import useResizeObserver from '@react-hook/resize-observer'
import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { FC, useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { CanvasAddon } from 'xterm-addon-canvas'
import { WebglAddon } from 'xterm-addon-webgl'
import { FitAddon } from 'xterm-addon-fit'

const Component: FC<{}> = () => {

    const target = useRef<HTMLDivElement | null>(null)
    const [id, setId] = useState('')

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

            const unlisten = await listen('SHELL-OUTPUT', (event) => {
                terminal.write(event.payload as Uint8Array)
            })

            await invoke('open_shell', {})
                .then((id) => {

                    if (target && target.current) {

                        terminal.open(target.current)
                        // terminal.loadAddon(new WebglAddon())
                        terminal.loadAddon(new CanvasAddon())
                        terminal.loadAddon(fitAddon)
                        terminal.onData((data) => {
                            invoke('input_shell', { id, toWrite: data })
                        })
                        fitAddon.fit()

                    }

                })
        }

        connect()

    }, [])

    useResizeObserver(target, () => fitAddon.fit())

    return (
        <div ref={target} style={{ height: '100%', width: '100%' }} />
    )

}

export default Component