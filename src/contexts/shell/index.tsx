import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import { IPty, ISystemShell } from 'src/types'
import cuid from 'cuid'
import { useRouter } from 'next/router'

const shellsAtom = atom<ISystemShell[]>([])
const ptysAtom = atom<Map<string, IPty>>(new Map())

const useContext = () => {
    const router = useRouter()

    const [shells, setShells] = useAtom(shellsAtom)
    const [ptys, setPtys] = useAtom(ptysAtom)

    const spawnShell = (shell: ISystemShell) => {
        const id = cuid()

        ptys.set(id, { id, shell })
        setPtys(ptys)

        router.push(`/terminal/${id}`).catch(console.error)
    }

    const despawnShell = (id: string) => {
        ptys.delete(id)
        setPtys(ptys)
    }

    useEffect(() => {
        const getSystemShells: () => Promise<void> = async () => {
            const shells = await invoke<ISystemShell[]>('get_system_shells', {})
            setShells(shells)
        }

        getSystemShells()
    }, [setShells])

    return {
        shells,
        ptys,
        spawnShell,
        despawnShell,
    }
}

export default useContext
