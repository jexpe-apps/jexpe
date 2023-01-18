import { createContext, useContext, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { FCWithChildren } from 'src/types'
import type { IPty, IPtyContext, IPtyExitPayload, IPtySize, IPtySpawnPayload, ISystemShell } from './types'
import { invoke } from '@tauri-apps/api/tauri'
import { useRouter } from 'next/router'

const PtyContext = createContext<IPtyContext>({
    shells: [],
    ptys: [],
    currentPty: undefined,
    setCurrentPty: () => undefined,
    spawnPty: () => undefined,
    writePty: () => undefined,
    resizePty: () => undefined,
    killPty: () => undefined,
})

export const PtyContextProvider: FCWithChildren = ({ children }) => {
    const [shells, setShells] = useState<ISystemShell[]>([])
    const [ptys, setPtys] = useState<IPty[]>([])
    const [currentPty, setCurrentPty] = useState<string | undefined>(undefined)
    const router = useRouter()

    const spawnPty = (shell: ISystemShell) => {
        invoke('spawn_pty', { shell }).catch(console.error)
    }

    const writePty = (id: string, data: string) => {
        invoke('write_pty', { id, data }).catch(console.error)
    }

    const resizePty = (id: string, size: IPtySize) => {
        invoke('resize_pty', { id, size }).catch(console.error)
    }

    const killPty = (id: string) => {
        invoke('kill_pty', { id }).catch(console.error)
    }

    useEffect(() => {
        invoke<ISystemShell[]>('get_system_shells').then(setShells).catch(console.error)

        const spawnListener = listen<IPtySpawnPayload>('pty-spawn', ({ payload }) => {
            setPtys((ptys) => {
                ptys.push({
                    id: payload.id,
                    shell: payload.shell,
                })

                return ptys
            })

            setCurrentPty(payload.id)

            if (router.asPath !== '/terminal') {
                void router.push('/terminal')
            }
        })

        const exitListener = listen<IPtyExitPayload>('pty-exit', ({ payload }) => {
            setPtys((ptys) => {
                const index = ptys.findIndex((pty) => pty.id === payload.id)

                const newPtys = ptys.filter((pty) => pty.id !== payload.id)

                // Handle tab switch on close
                if (ptys.length - 1 > 0) {
                    setCurrentPty(newPtys[index >= newPtys.length ? newPtys.length - 1 : index].id)
                } else {
                    void router.push('/')
                }

                return [...newPtys]
            })
        })

        return () => {
            spawnListener.then((fn) => fn()).catch(console.error)

            exitListener.then((fn) => fn()).catch(console.error)
        }
    }, [ptys, router])

    return (
        <PtyContext.Provider
            value={{
                shells,
                ptys: Array.from(ptys.values()),
                currentPty,
                setCurrentPty,
                spawnPty,
                writePty,
                resizePty,
                killPty,
            }}
        >
            {children}
        </PtyContext.Provider>
    )
}

export const usePty = () => useContext(PtyContext)
