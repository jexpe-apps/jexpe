import useResizeObserver from '@react-hook/resize-observer'
import { FC, useEffect, useRef } from 'react'
import { CanvasAddon } from 'xterm-addon-canvas'
import { FitAddon } from 'xterm-addon-fit'
import { useTabManager } from 'src/contexts'
import { WebglAddon } from 'xterm-addon-webgl'

const Component: FC<{
    id: string
}> = ({ id }) => {
    const target = useRef<HTMLDivElement | null>(null)

    const { ptys, writeToPty } = useTabManager()

    const fitAddon = new FitAddon()

    useEffect(() => {
        if (target && target.current) {
            const pty = ptys.find((pty) => pty.id === id)
            if (!pty) {
                return // TODO: handle this
            }

            pty.terminal.open(target.current)
            // pty.terminal.loadAddon(new WebglAddon())
            pty.terminal.loadAddon(new CanvasAddon())
            pty.terminal.loadAddon(fitAddon)
            pty.terminal.onData((data) => {
                writeToPty(id, data)
            })
            fitAddon.fit()
        }
    }, [])

    useResizeObserver(target, () => fitAddon.fit())

    return <div ref={target} style={{ height: '100%', width: '100%' }} />
}

export default Component
