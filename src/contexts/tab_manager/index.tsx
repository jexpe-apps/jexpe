import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { type Terminal as ITerminal } from 'xterm'

interface IShell {
    display_name: string
    icon: string
    command: string
}

interface IPty {
    id: string
    shell: IShell
    terminal: ITerminal
}

const shellsAtom = atom<IShell[]>([])
const ptysAtom = atom<IPty[]>([])

const useContext = () => {
    const [shells, setShells] = useAtom(shellsAtom)
    const [ptys, setPtys] = useAtom(ptysAtom)

    const getAvailableSystemShells = async () => {
        const shells = await invoke<IShell[]>('get_os_shells', {})
        setShells(shells)
    }

    const openPty = async (shell: IShell) => {
        const id = await invoke<string>('spawn_shell', { command: shell.command })
        console.log('Shell exited with id: ', id)
    }

    const writeToPty = async (id: string, data: string) => {
        await invoke('write_shell', { id, data })
    }

    useEffect(() => {
        getAvailableSystemShells()

        const subscribe = async () => {

            const _ = await listen<{ id: string; bytes: Uint8Array }>(
                'pty-stdout',
                ({ payload }) => {
                    const pty = ptys.find((pty) => pty.id === payload.id)
                    if (!pty) {
                        return // TODO: handle this
                    }

                    console.log('pty-output', payload.bytes)
                    pty.terminal.write(payload.bytes)
                },
            )

            const __ = await listen<string>(
                'pty-spawned',
                async ({ payload }) => {

                    const { Terminal } = await import('xterm')
                    setPtys([
                        {
                            id: payload,
                            shell: {
                                display_name: 'Bash',
                                icon: 'bash',
                                command: 'bash',
                            },
                            terminal: new Terminal({
                                theme: {
                                    background: '#161616',
                                },
                                fontFamily: 'Cascadia Mono',
                                cursorBlink: true,
                                cursorStyle: 'block',
                                // convertEol: true,
                                allowProposedApi: true,
                            }),
                        },
                        ...ptys,
                    ])

                },
            )
        }

        subscribe()
    }, [])

    return {
        shells,
        ptys,
        openPty,
        writeToPty,
    }
}

export default useContext
