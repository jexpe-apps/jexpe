import type { Terminal as XTerm } from 'xterm'
import type { UniqueObject } from 'src/types'

export interface ITerminal extends UniqueObject {
    title: string
    shell: ISystemShell
    xterm: XTerm
}

export interface ITerminalContext {
    shells: ISystemShell[]

    spawnShell: (shell: ISystemShell) => void
    terminals: ITerminal[]
    focused: string | undefined
    focus: (id: string) => void
}
export interface ISystemShell {
    id: string
    name: string
    command: string
    args?: string[]
    env: Record<string, string>
    cwd?: string
    icon: string
}

export interface IPTYSpawnPayload extends UniqueObject {
    shell: ISystemShell
}

export interface IPTYSdoutPayload extends UniqueObject {
    bytes: Uint8Array
}

export interface IPTYExitPayload extends UniqueObject {
    success: boolean
    code?: number
}
