import { createContext, createElement, useContext, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { FCWithChildren } from 'src/types'
import type { IPty, IPtyContext, IPtyExitPayload, IPtySize, IPtySpawnPayload, ISystemShell } from './types'
import { invoke } from '@tauri-apps/api/tauri'
import { useRouter } from 'next/router'
import { Terminal } from 'xterm'
import { IPtyStdoutPayload } from 'src/components/xterm/types'

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
        invoke<ISystemShell[]>('get_system_shells')
            .then(setShells)
            .catch(console.error)
    }, [])

    // useEffect(() => {
    //
    //     const spawnListener = listen<IPtySpawnPayload>('pty-spawn', ({ payload }) => {
    //         import('xterm')
    //             .then(({ Terminal }) => {
    //
    //                 const terminal = new Terminal({
    //                     theme: {
    //                         background: '#1A1B1E',
    //                         cursor: '#10B981',
    //                         cursorAccent: '#10B98100',
    //                     },
    //                     fontFamily: 'Cascadia Mono, MesloLGS NF',
    //                     fontWeight: 'normal',
    //                     fontSize: 14,
    //                     cursorBlink: true,
    //                 })
    //
    //                 terminal.onData((data) => writePty(payload.id, data))
    //                 terminal.onResize((size) => {
    //                     resizePty(payload.id, {
    //                         cols: size.cols,
    //                         rows: size.rows,
    //                         pixel_width: 0,
    //                         pixel_height: 0,
    //                     })
    //                 })
    //
    //                 const canvas = createElement('div', {
    //                     display: payload.id === currentPty ? 'block' : 'none',
    //                     overflow: 'hidden',
    //                     height: '100%',
    //                     width: '100%',
    //                 })
    //
    //                 setPtys((ptys) => {
    //                     ptys.push({
    //                         id: payload.id,
    //                         shell: payload.shell,
    //                         terminal,
    //                         canvas,
    //                     })
    //                     return ptys
    //                 })
    //
    //                 setCurrentPty(payload.id)
    //
    //                 if (router.asPath !== '/terminal') {
    //                     void router.push('/terminal')
    //                 }
    //
    //             })
    //             .catch(console.error)
    //     })
    //
    //     const exitListener = listen<IPtyExitPayload>('pty-exit', ({ payload }) => {
    //         setPtys((ptys) => {
    //             const index = ptys.findIndex((pty) => pty.id === payload.id)
    //
    //             const newPtys = ptys.filter((pty) => pty.id !== payload.id)
    //
    //             // Handle tab switch on close
    //             if (ptys.length - 1 > 0) {
    //                 setCurrentPty(newPtys[index >= newPtys.length ? newPtys.length - 1 : index].id)
    //             } else {
    //                 void router.push('/')
    //             }
    //
    //             return [...newPtys]
    //         })
    //     })
    //
    //     const stdoutListener = listen<IPtyStdoutPayload>('pty-stdout', ({ payload }) => {
    //
    //         const index = ptys.findIndex((pty) => pty.id === payload.id)
    //
    //         if (index < 0) {
    //             return
    //         }
    //
    //         ptys[index].terminal.write(payload.bytes)
    //     })
    //
    //
    //     return () => {
    //         spawnListener.then((fn) => fn()).catch(console.error)
    //         exitListener.then((fn) => fn()).catch(console.error)
    //         stdoutListener.then((unlisten) => unlisten()).catch(console.error)
    //     }
    //
    // }, [router])

    return (
        <PtyContext.Provider
            value={{
                shells,
                ptys,
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
