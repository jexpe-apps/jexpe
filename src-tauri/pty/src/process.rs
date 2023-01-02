use std::ffi::OsStr;
use std::io;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use async_std::channel::bounded;
use async_std::task::{sleep, spawn, spawn_blocking};
use log::{error, trace};
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use crate::{Environment, FutureReturn, PtyProcess, wait};
use crate::constants::{MAX_PIPE_CHUNK_SIZE, READ_PAUSE_DURATION};
use crate::wait::ExitStatus;

impl PtyProcess {
    pub fn spawn<S, I>(
        program: S,
        args: I,
        environment: Option<Environment>,
        current_dir: Option<PathBuf>,
        size: PtySize,
    ) -> io::Result<Self>
        where
            S: AsRef<OsStr>,
            I: IntoIterator<Item=S>,
    {

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

        if let Some(environment) = environment {
            for (key, value) in environment {
                cmd.env(key, value);
            }
        }


        let mut child = pty_slave
            .spawn_command(cmd)
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        // Need to drop slave to close out file handles and avoid deadlock when waiting on the child
        drop(pty_slave);

        // Spawn a blocking task to process submitting stdin async
        let (stdin_tx, mut stdin_rx) = bounded::<Vec<u8>>(1);

        let mut stdin_writer = pty_master.take_writer()
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        let stdin_task = spawn_blocking(async move {
            while let Some(input) = stdin_rx.blocking_recv() {
                if stdin_writer.write_all(&input).is_err() {
                    break;
                }
            }
        });

        // Spawn a blocking task to process receiving stdout async
        let (stdout_tx, stdout_rx) = bounded::<Vec<u8>>(1);

        let mut stdout_reader = pty_master.try_clone_reader()
            .map_err(|x| io::Error::new(io::ErrorKind::Other, x))?;

        let stdout_task = spawn_blocking(async move {
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

        let (kill_tx, mut kill_rx) = bounded(1);
        let (mut wait_tx, wait_rx) = wait::channel();

        spawn(async move {
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
                        sleep(READ_PAUSE_DURATION).await;
                        continue;
                    }
                }
            }
        });

        Ok(Self {
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