import type { Terminal } from 'xterm'
import { ReactElement } from 'react'

export interface IXTermProps {
    id: string
    terminal: Terminal

    canvas: ReactElement
}

export interface IPtyStdoutPayload {
    id: string
    bytes: Uint8Array
}
