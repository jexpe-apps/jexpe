import { atom, useAtom } from 'jotai'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'
import type { IVault } from 'src/types'

const tokenAtom = atom<string | undefined>(undefined)
const vaultAtom = atom<IVault | undefined>(undefined)

const useContext = () => {

    const [token, setToken] = useAtom(tokenAtom)
    const [vault, setVault] = useAtom(vaultAtom)

    const tryMasterPassword = async (password: string) => {
        const token = await invoke('try_master_password', { masterPassword: password })
        setToken(token as string)
    }

    const fetchVault = async () => {
        try {
            const vault = await invoke('get_vault', { token })
            setVault(vault as IVault)
        } catch (error) {
            setVault(undefined)
            setToken(undefined)
        }
    }

    useEffect(() => {

        if (token === undefined) {
            return
        }

        if (vault !== undefined) {
            return
        }

        fetchVault()

    }, [token])

    return {
        loading: token !== undefined && vault === undefined,
        token,
        tryMasterPassword,
        vault,
        fetchVault,
    }
}

export default useContext