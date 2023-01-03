use std::collections::HashMap;
use std::io;
use std::io::Write;
use std::sync::Mutex;
use tauri::async_runtime::spawn_blocking;
use tokio::spawn;
use pty::{PtyProcess, PtySize};

pub struct JexpeState {
    ptys: Mutex<HashMap<String, PtyProcess>>,
}

impl JexpeState {
    fn new() -> Self {
        Self {
            ptys: Mutex::new(HashMap::new()),
        }
    }
}

#[tokio::main]
async fn main() {
    // tauri::Builder::default()
    //     .manage(JexpeState::new())
    //     .invoke_handler(tauri::generate_handler![
    //     ])
    //     .run(tauri::generate_context!())
    //     .expect("error while running jexpe application");

    let mut pty = PtyProcess::spawn("cmd.exe", [], None, None, PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    }).unwrap();

    let mut stdout = pty.take_stdout().unwrap();
    let mut stdin = pty.take_stdin().unwrap();

    let stdout_task = spawn(async move {
        while let Ok(data) = stdout.recv().await {
            match data {
                Some(bytes) => {
                    print!("{}", String::from_utf8(bytes).unwrap());
                    io::stdout().flush().unwrap();
                }
                None => {
                    println!("BUFFER EMPTY!");
                }
            }
        }

        println!("CHANNEL CLOSED!");
    });

    let stdin_task = spawn(async move {
        loop {
            let io_stdin = std::io::stdin();
            let mut line = String::new();
            io_stdin.read_line(&mut line).unwrap();

            stdin.send(line.as_bytes()).await.unwrap();
        }
    });

    stdin_task.await.unwrap();
    stdout_task.await.unwrap();
}
