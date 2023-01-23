pub fn get_available_shells() -> Vec<SystemShell> {
    let mut shells = Vec::new();

    // TODO: /usr/bin/dscl . -read /Users/${LOGNAME} UserShell`

    shells
}