import { createContext, useContext, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { FCWithChildren } from 'src/types'
import type {
    IPty,
    IPtyContext,
    IPtyExitPayload,
    IPtySize,
    IPtySpawnPayload,
    IPtyStdoutPayload,
    ISystemShell,
} from './types'
import { Terminal } from 'xterm'
import { invoke } from '@tauri-apps/api/tauri'

const PtyContext = createContext<IPtyContext>({
    shells: [],
    ptys: [],
    currentPty: undefined,
    spawnPty: () => {
    },
    writePty: () => {
    },
    resizePty: () => {
    },
    killPty: () => {
    },
})

export const PtyContextProvider: FCWithChildren = ({ children }) => {

    const [shells, setShells] = useState<ISystemShell[]>([])
    const [ptys, setPtys] = useState<Map<string, IPty>>(new Map())
    const [currentPty, setCurrentPty] = useState<string | undefined>(undefined)

    const spawnPty = (shell: ISystemShell) => {
        invoke<void>('spawn_pty', { shell })
            .catch(console.error)
    }

    const writePty = (id: string, data: string) => {
        invoke<void>('write_pty', { id, data })
            .catch(console.error)
    }

    const resizePty = (id: string, size: IPtySize) => {
        invoke<void>('resize_pty', { id, size })
            .catch(console.error)
    }

    const killPty = (id: string) => {
        invoke<void>('kill_pty', { id })
            .catch(console.error)
    }

    useEffect(() => {

        console.log('UseEffect called.')

        invoke<ISystemShell[]>('get_system_shells')
            .then(setShells)
            .catch(console.error)

        const spawnListener = listen<IPtySpawnPayload>(
            'pty-spawn',
            async ({ payload }) => {

                console.log('pty-spawn', payload)

                const { Terminal } = await import('xterm')

                setPtys((ptys) => {
                    ptys.set(payload.id, {
                        id: payload.id,
                        shell: payload.shell,
                        terminal: new Terminal({
                            theme: {
                                background: '#1A1B1E',
                            },
                            fontFamily: 'Cascadia Mono, MesloLGS NF',
                            fontWeight: 'normal',
                            fontSize: 14,
                            cursorBlink: true,
                        }),
                    })
                    return ptys
                })

                setCurrentPty(payload.id)
            },
        )

        const exitListener = listen<IPtyExitPayload>(
            'pty-exit',
            async ({ payload }) => {

                console.log('pty-exit', payload)

                setPtys((ptys) => {
                    ptys.delete(payload.id)
                    return ptys
                })
            },
        )

        const stdoutListener = listen<IPtyStdoutPayload>(
            'pty-stdout',
            async ({ payload }) => {

                console.log('pty-stdout', payload)

                const pty = ptys.get(payload.id)
                if (!pty) {
                    return
                }

                pty.terminal.write(payload.bytes)
            },
        )

        return () => {
            spawnListener.then(fn => fn())
            exitListener.then(fn => fn())
            stdoutListener.then(fn => fn())
        }

    }, [])

    return (
        <PtyContext.Provider value={{
            shells,
            ptys: Array.from(ptys.values()),
            currentPty,
            spawnPty,
            writePty,
            resizePty,
            killPty,
        }}>
            {children}
        </PtyContext.Provider>
    )
}

export const usePty = () => useContext(PtyContext)