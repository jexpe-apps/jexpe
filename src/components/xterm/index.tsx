import useResizeObserver from '@react-hook/resize-observer'
import { FC, useEffect, useMemo, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { usePty } from 'src/contexts'
import { Terminal } from 'xterm'
import { listen } from '@tauri-apps/api/event'
import type { IXTermProps, IPtyStdoutPayload } from './types'

const Component: FC<IXTermProps> = ({ id }) => {
    const { writePty, resizePty } = usePty()

    const target = useRef<HTMLDivElement | null>(null)
    const fitAddon = useMemo(() => new FitAddon(), [])

    const terminal = useMemo(
        () =>
            new Terminal({
                theme: {
                    background: '#1A1B1E',
                },
                fontFamily: 'Cascadia Mono, MesloLGS NF',
                fontWeight: 'normal',
                fontSize: 14,
                cursorBlink: true,
            }),
        []
    )

    useEffect(() => {
        if (!target.current) {
            return
        }

        terminal.open(target.current)
        terminal.focus()
        terminal.loadAddon(fitAddon)

        terminal.onData((data) => writePty(id, data))
        terminal.onResize((size) =>
            resizePty(id, {
                cols: size.cols,
                rows: size.rows,
                pixel_width: 0,
                pixel_height: 0,
            })
        )

        fitAddon.fit()

        const listener = listen<IPtyStdoutPayload>('pty-stdout', ({ payload }) => {
            if (payload.id !== id) {
                return
            }

            terminal.write(payload.bytes)
        })

        return () => {
            listener.then((unlisten) => unlisten()).catch(console.error)

            terminal.dispose()
        }
    }, [fitAddon, id, resizePty, terminal, writePty])

    useResizeObserver(target, () => {
        const dimensions = fitAddon.proposeDimensions()
        if (!dimensions) {
            return
        }

        terminal.clear()

        resizePty(id, {
            cols: dimensions.cols,
            rows: dimensions.rows,
            pixel_width: 0,
            pixel_height: 0,
        })

        fitAddon.fit()
    })

    return <div key={id} ref={target} style={{ overflow: 'hidden', height: '100%', width: '100%' }} />
}

export default Component
