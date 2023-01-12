import useResizeObserver from '@react-hook/resize-observer'
import { FC, useEffect, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { WebglAddon } from 'xterm-addon-webgl'
import { useShell } from 'src/contexts'
import { Terminal } from 'xterm'
import { invoke } from '@tauri-apps/api/tauri'
import { router } from 'next/client'
import { listen } from '@tauri-apps/api/event'
import dynamic from 'next/dynamic'

const Component: FC<{
    id: string
}> = ({ id }) => {
    const { ptys, despawnShell } = useShell()

    const target = useRef<HTMLDivElement | null>(null)
    const fitAddon = new FitAddon()

    const vID = useRef<string>('')

    useEffect(() => {

        const subscribev0 = listen<string>('pty-spawn', ({ payload }) => {
            console.log('Spawned pty: ', payload)
            vID.current = payload
        })

        const subscribev1 = listen<{
            id: string
            bytes: Uint8Array
        }>('pty-stdout', ({ payload: { id, bytes } }) => {

            console.log('Received stdout: ', id, bytes)

            const pty = ptys.get(id)
            if (!pty || !pty.terminal) {
                return // TODO: handle this
            }

            console.log('Writing to terminal: ', bytes)

            pty.terminal.write(bytes)
        })

        const subscribev2 = listen<{
            id: string,
            success: boolean,
            code?: number,
        }>('pty-exit', ({ payload }) => {
            console.log('Exited pty: ', payload)
        })

        if (target.current) {
            const pty = ptys.get(id)
            if (!pty) {
                return // TODO: handle this
            }

            pty.terminal = new Terminal({
                theme: {
                    background: '#1A1B1E',
                },
                fontFamily: 'Cascadia Mono, MesloLGS NF',
                fontWeight: 'normal',
                fontSize: 14,
                cursorBlink: true,
                // allowProposedApi: true,
            })

            pty.terminal.open(target.current)
            // pty.terminal.loadAddon(new WebglAddon())
            // pty.terminal.loadAddon(new CanvasAddon())
            pty.terminal.loadAddon(fitAddon)
            pty.terminal.onData((data: string) => {
                console.log('Sending data to pty: ', vID)
                invoke('beta_write_pty', { id: vID.current, data })
                // TODO: handle response
            })

            fitAddon.fit()

            pty.terminal.onResize((event) => {

                console.log('Resizing pty: ', event)

                // invoke('resize_pty', {
                //     id,
                //     size: {
                //         cols,
                //         rows,
                //         pixel_width: 0,
                //         pixel_height: 0,
                //     },
                // }).catch(console.error)
            })

            invoke<string>('beta_spawn_pty', {
                id,
                shell: pty.shell,
                // size: {
                //     cols: pty.terminal.cols,
                //     rows: pty.terminal.rows,
                //     pixel_width: 0,
                //     pixel_height: 0,
                // },
            }).catch(console.error)
        }

        return () => {
            subscribev0.then((unsubscribe) => unsubscribe())
            subscribev1.then((unsubscribe) => unsubscribe())
            subscribev2.then((unsubscribe) => unsubscribe())
        }
    }, [])

    useResizeObserver(target, () => {
        console.log('Resizing terminal')
        fitAddon.fit()
    })

    return <div ref={target} style={{ height: '100%', width: '100%' }} />
}

export default Component
// export default dynamic(() => Promise.resolve(Component), { ssr: false })
