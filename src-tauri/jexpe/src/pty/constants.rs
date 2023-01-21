use std::time::Duration;

/// Represents the maximum size (in bytes) that data will be read from pipes
/// per individual `read` call
///
/// Current setting is 16k size
pub const MAX_PIPE_CHUNK_SIZE: usize = 16384;

/// Duration in milliseconds to sleep between reading stdout/stderr chunks
/// to avoid sending many small messages to clients
pub const READ_PAUSE_DURATION: Duration = Duration::from_millis(1);

/// Events that can be emitted by the pty
pub const PTY_SPAWN_EVENT: &str = "EVENTS:PTY:SPAWN";
pub const PTY_STDOUT_EVENT: &str = "EVENTS:PTY:STDOUT";
pub const PTY_EXIT_EVENT: &str = "EVENTS:PTY:EXIT";