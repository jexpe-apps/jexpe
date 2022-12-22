import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'

interface IShell {
    display_name: string,
    icon: string,
    command: string,
}

interface IPty {
    id: string,
    shell: IShell,
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
        setPtys([{ id, shell }, ...ptys])
    }

    const writeToPty = async (id: string, input: string) => {
        await invoke('write_to_pty', { id, input })
    }

    useEffect(() => {

        getAvailableSystemShells()

    }, [])

    return {
        shells,
        ptys,
        openPty,
        writeToPty,
    }

}

export default useContext