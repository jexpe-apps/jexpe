/*
    Credits for this pty implementation goes to:
    https://github.com/chipsenkbeil from his
    https://github.com/chipsenkbeil/distant project.
 */

use std::ffi::OsStr;
use std::future::Future;
use std::io;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::{Arc, Mutex};
use log::{error, trace};
use portable_pty::{CommandBuilder, MasterPty, NativePtySystem, PtySize, PtySystem};
use tokio::sync::mpsc::{channel, Receiver, Sender};
use tokio::task::JoinHandle;
use crate::constants::{MAX_PIPE_CHUNK_SIZE, READ_PAUSE_DURATION};
use crate::wait::{ExitStatus, WaitRx};

mod constants;
mod wait;

/// Alias to the return type of an async function (for use with traits)
pub type FutureReturn<'a, T> = Pin<Box<dyn Future<Output=T> + Send + 'a>>;

/// Represents an input channel of a process such as stdin
pub trait InputChannel: Send + Sync {
    /// Sends input through channel, returning unit if succeeds or an error if fails
    fn send(&mut self, data: &[u8]) -> FutureReturn<io::Result<()>>;
}

impl InputChannel for Sender<Vec<u8>> {
    fn send(&mut self, data: &[u8]) -> FutureReturn<io::Result<()>> {
        let data = data.to_vec();
        Box::pin(async move {
            match Sender::send(self, data).await {
                Ok(_) => Ok(()),
                Err(_) => Err(io::Error::new(
                    io::ErrorKind::BrokenPipe,
                    "Input channel closed",
                )),
            }
        })
    }
}

/// Represents an output channel of a process such as stdout or stderr
pub trait OutputChannel: Send + Sync {
    /// Waits for next output from channel, returning Some(data) if there is output, None if
    /// the channel has been closed, or bubbles up an error if encountered
    fn recv(&mut self) -> FutureReturn<'_, io::Result<Option<Vec<u8>>>>;
}

impl OutputChannel for Receiver<Vec<u8>> {
    fn recv(&mut self) -> FutureReturn<'_, io::Result<Option<Vec<u8>>>> {
        Box::pin(async move { Ok(Receiver::recv(self).await) })
    }
}

pub struct PtyProcess {
    id: u32,
    pty_master: Option<Arc<Mutex<Box<dyn MasterPty + Send>>>>,
    stdin: Option<Box<dyn InputChannel>>,
    stdout: Option<Box<dyn OutputChannel>>,
    stdin_task: Option<JoinHandle<()>>,
    stdout_task: Option<JoinHandle<io::Result<()>>>,
    kill_tx: Sender<()>,
    wait: WaitRx,
}

impl PtyProcess {
    pub fn spawn<S, I>(
        program: S,
        args: I,
        // environment: Environment,
        current_dir: Option<PathBuf>,
        size: PtySize,
    ) -> io::Result<Self>
        where
            S: AsRef<OsStr>,
            I: IntoIterator<Item=S>,
    {
        let id = rand::random();

        // Establish our new pty for the given size
        let pty_system = NativePtySystem::default();
        let pty_pair = pty_system.openpty(size)
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        let pty_master = pty_pair.master;
        let pty_slave = pty_pair.slave;

        // Spawn our process with the pty
        let mut cmd = CommandBuilder::new(program);
        cmd.args(args);

        if let Some(path) = current_dir {
            cmd.cwd(path);
        }

        // for (key, value) in environment {
        //     cmd.env(key, value);
        // }

        let mut child = pty_slave
            .spawn_command(cmd)
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        // Need to drop slave to close out file handles and avoid deadlock when waiting on the child
        drop(pty_slave);

        // Spawn a blocking task to process submitting stdin async
        let (stdin_tx, mut stdin_rx) = channel::<Vec<u8>>(1);

        let mut stdin_writer = pty_master.take_writer()
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        let stdin_task = tokio::task::spawn_blocking(move || {
            while let Some(input) = stdin_rx.blocking_recv() {
                if stdin_writer.write_all(&input).is_err() {
                    break;
                }
            }
        });

        // Spawn a blocking task to process receiving stdout async
        let (stdout_tx, stdout_rx) = channel::<Vec<u8>>(1);

        let mut stdout_reader = pty_master.try_clone_reader()
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        let stdout_task = tokio::task::spawn_blocking(move || {
            let mut buf: [u8; MAX_PIPE_CHUNK_SIZE] = [0; MAX_PIPE_CHUNK_SIZE];
            loop {
                match stdout_reader.read(&mut buf) {
                    Ok(n) if n > 0 => {
                        stdout_tx.blocking_send(buf[..n].to_vec()).map_err(|_| {
                            io::Error::new(io::ErrorKind::BrokenPipe, "Output channel closed")
                        })?;
                    }
                    Ok(_) => return Ok(()),
                    Err(x) => return Err(x),
                }
            }
        });

        let (kill_tx, mut kill_rx) = channel(1);
        let (mut wait_tx, wait_rx) = wait::channel();

        tokio::spawn(async move {
            loop {
                match (child.try_wait(), kill_rx.try_recv()) {
                    (Ok(Some(status)), _) => {
                        trace!(
                            "Pty process {id} has exited: success = {}",
                            status.success()
                        );

                        if let Err(x) = wait_tx
                            .send(ExitStatus {
                                success: status.success(),
                                code: None,
                            })
                            .await
                        {
                            error!("Pty process {id} exit status lost: {x}");
                        }

                        break;
                    }
                    (_, Ok(_)) => {
                        trace!("Pty process {id} received kill request");

                        if let Err(x) = wait_tx.kill().await {
                            error!("Pty process {id} exit status lost: {x}");
                        }

                        break;
                    }
                    (Err(x), _) => {
                        trace!("Pty process {id} failed to wait");

                        if let Err(x) = wait_tx.send(x).await {
                            error!("Pty process {id} exit status lost: {x}");
                        }

                        break;
                    }
                    _ => {
                        tokio::time::sleep(READ_PAUSE_DURATION).await;
                        continue;
                    }
                }
            }
        });

        Ok(Self {
            id,
            pty_master: Some(Arc::new(Mutex::new(pty_master))),
            stdin: Some(Box::new(stdin_tx)),
            stdout: Some(Box::new(stdout_rx)),
            stdin_task: Some(stdin_task),
            stdout_task: Some(stdout_task),
            kill_tx,
            wait: wait_rx,
        })
    }

    fn id(&self) -> u32 {
        self.id
    }

    fn wait(&mut self) -> FutureReturn<'_, io::Result<ExitStatus>> {
        async fn inner(this: &mut PtyProcess) -> io::Result<ExitStatus> {
            let mut status = this.wait.recv().await?;

            // Drop our master once we have finished
            let _ = this.pty_master.take();

            if let Some(task) = this.stdin_task.take() {
                task.abort();
            }
            if let Some(task) = this.stdout_task.take() {
                let _ = task.await;
            }

            if status.success && status.code.is_none() {
                status.code = Some(0);
            }

            Ok(status)
        }
        Box::pin(inner(self))
    }

    fn kill(&mut self) -> FutureReturn<'_, io::Result<()>> {
        async fn inner(this: &mut PtyProcess) -> io::Result<()> {
            this.kill_tx
                .send(())
                .await
                .map_err(|x| io::Error::new(io::ErrorKind::BrokenPipe, x))
        }
        Box::pin(inner(self))
    }
}