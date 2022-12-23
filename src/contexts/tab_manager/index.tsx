import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import dynamic from 'next/dynamic'
import { Terminal as ITerminal } from 'xterm'

interface IShell {
    display_name: string,
    icon: string,
    command: string,
}

interface IPty {
    id: string,
    shell: IShell,
    terminal: ITerminal,
}

const shellsAtom = atom<IShell[]>([])
const ptysAtom = atom<IPty[]>([])

const useContext = () => {

    const [shells, setShells] = useAtom(shellsAtom)
    const [ptys, setPtys] = useAtom(ptysAtom)

    const getAvailableSystemShells = async () => {
        const shells = await invoke<IShell[]>('get_available_system_shells', {})
        setShells(shells)
    }

    const openPty = async (shell: IShell) => {
        const id = await invoke<string>('open_pty', { shell })

        const { Terminal } = await import('xterm') // dynamic import xterm

        setPtys([{
            id,
            shell,
            terminal: new Terminal({
                theme: {
                    background: '#161616',
                },
                fontFamily: 'MesloLGS NF, Menlo, Monaco, \'Courier New\', monospace',
                cursorBlink: true,
                cursorStyle: 'block',
                // convertEol: true,
                allowProposedApi: true,
            }),
        }, ...ptys])
    }

    const writeToPty = async (id: string, input: string) => {
        await invoke('write_to_pty', { id, input })
    }

    useEffect(() => {

        getAvailableSystemShells()

        const subscribeToPtyOutput = async () => {
            const unlisten = await listen<{ id: string, data: Uint8Array }>('pty-output', ({ payload }) => {

                const pty = ptys.find((pty) => pty.id === payload.id)
                if (!pty) {
                    return // TODO: handle this
                }

                console.log('pty-output', payload.data)
                pty.terminal.write(payload.data)
            })
        }

        subscribeToPtyOutput()

    }, [])

    return {
        shells,
        ptys,
        openPty,
        writeToPty,
    }

}

export default useContext