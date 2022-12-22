import useResizeObserver from '@react-hook/resize-observer'
import { listen } from '@tauri-apps/api/event'
import { FC, useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { CanvasAddon } from 'xterm-addon-canvas'
import { FitAddon } from 'xterm-addon-fit'
import { useTabManager } from 'src/contexts'

const Component: FC<{
    id: string
}> = ({ id }) => {

    const target = useRef<HTMLDivElement | null>(null)

    const { writeToPty } = useTabManager()

    const terminal = new Terminal({
        theme: {
            background: '#161616',
        },
        fontFamily: 'MesloLGS NF, Menlo, Monaco, \'Courier New\', monospace',
        cursorBlink: true,
        cursorStyle: 'block',
        // convertEol: true,
        allowProposedApi: true,
    })
    const fitAddon = new FitAddon()

    useEffect(() => {

        const connect = async () => {

            const unlisten = await listen<{ id: string, data: Uint8Array }>('pty-output', (event) => {
                if (event.payload.id === id) {
                    terminal.write(event.payload.data)
                }
            })

            if (target && target.current) {

                terminal.open(target.current)
                // terminal.loadAddon(new WebglAddon())
                terminal.loadAddon(new CanvasAddon())
                terminal.loadAddon(fitAddon)
                terminal.onData((data) => {
                    writeToPty(id, data)
                })
                fitAddon.fit()

            }
        }

        connect()

    }, [])

    useResizeObserver(target, () => fitAddon.fit())

    return (
        <div ref={target} style={{ height: '100%', width: '100%' }} />
    )

}

export default Component