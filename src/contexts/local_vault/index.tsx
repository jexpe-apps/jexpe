import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { showNotification } from '@mantine/notifications'
import { X } from 'phosphor-react'
import { useRouter } from 'next/router'

const isVaultUnlockedAtom = atom<boolean | undefined>(undefined)
const useContext = () => {

    const router = useRouter()
    const [isVaultUnlocked, setVaultUnlocked] = useAtom(isVaultUnlockedAtom)

    const unlockVault = async (password: string) => {

        try {
            await invoke('unlock_vault', { masterPassword: password })
            setVaultUnlocked(true)
            await router.push('/')

            showNotification({
                title: 'Success',
                message: 'Vault opened',
                icon: <X size={18} />,
            })

        } catch (e: any) {
            showNotification({
                color: 'red',
                title: 'Wrong password',
                message: e, // 'The password you entered is incorrect',
                icon: <X size={18} />,
            })
        }
    }

    useEffect(() => {

        invoke('is_vault_unlocked')
            .then(() => setVaultUnlocked(true))
            .catch(() => setVaultUnlocked(false))

    }, [])

    useEffect(() => {
        console.log('isVaultUnlocked', isVaultUnlocked)
    }, [isVaultUnlocked])

    return {
        loading: isVaultUnlocked === undefined,
        isVaultUnlocked,
        unlockVault,
    }
}

export default useContext