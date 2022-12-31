/*
    Credits for this pty implementation goes to:
    https://github.com/chipsenkbeil from his
    https://github.com/chipsenkbeil/distant project.
 */

use std::time::Duration;

/// Represents the maximum size (in bytes) that data will be read from pipes
/// per individual `read` call
///
/// Current setting is 16k size
pub const MAX_PIPE_CHUNK_SIZE: usize = 16384;

/// Duration in milliseconds to sleep between reading stdout/stderr chunks
/// to avoid sending many small messages to clients
pub const READ_PAUSE_DURATION: Duration = Duration::from_millis(1);