import type { Terminal } from "xterm"
import { ReactElement } from 'react'

export interface ISystemShell {
    display_name: string
    icon: string
    command: string
    directory: string
}

export interface IPtySize {
    rows: number
    cols: number
    pixel_width: number
    pixel_height: number
}

export interface IPty {
    id: string
    shell: ISystemShell
    terminal: Terminal

    canvas: ReactElement
}

export interface IPtySpawnPayload {
    id: string
    shell: ISystemShell
}

export interface IPtyExitPayload {
    id: string
    success: boolean
    code?: number
}

export interface IPtyContext {
    shells: ISystemShell[]
    ptys: IPty[]
    currentPty: string | undefined
    setCurrentPty: (id: string) => void
    spawnPty: (shell: ISystemShell) => void
    writePty: (id: string, data: string) => void
    resizePty: (id: string, size: IPtySize) => void
    killPty: (id: string) => void
}
