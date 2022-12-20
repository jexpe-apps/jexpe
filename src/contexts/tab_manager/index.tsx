import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'

interface IShell {
    display_name: string,
    icon: string,
    command: string,
}

const shellsAtom = atom<IShell[]>([])

const useContext = () => {

    const [shells, setShells] = useAtom(shellsAtom)

    const fetchAvailableSystemShells = async () => {
        const shells = await invoke('get_os_shells', {})
        setShells(shells as IShell[])
    }

    useEffect(() => {

        fetchAvailableSystemShells()

    }, [])

    return {
        shells,
    }

}

export default useContext