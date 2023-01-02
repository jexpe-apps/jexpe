use std::collections::HashMap;
use std::future::Future;
use std::io;
use std::pin::Pin;
use std::sync::{Arc, Mutex};
use async_std::channel::{Receiver, Sender};
use async_std::task::JoinHandle;
use portable_pty::MasterPty;
use crate::wait::WaitRx;

mod constants;
mod wait;
mod process;

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

pub type Environment = HashMap<String, String>;

pub struct PtyProcess {
    pty_master: Option<Arc<Mutex<Box<dyn MasterPty + Send>>>>,
    stdin: Option<Box<dyn InputChannel>>,
    stdout: Option<Box<dyn OutputChannel>>,
    stdin_task: Option<JoinHandle<()>>,
    stdout_task: Option<JoinHandle<io::Result<()>>>,
    kill_tx: Sender<()>,
    wait: WaitRx,
}