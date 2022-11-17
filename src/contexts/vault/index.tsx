import { atom, useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import type { IVault, Maybe } from 'src/types'

import { __LOAD_VAULT, __UNLOCK } from 'src/__dummy/vault'

const vaultsAtom = atom<Maybe<IVault[]>>(undefined)

const useContext = () => {

    const [isLoading, setLoading] = useState(false)
    const [vaults, setVaults] = useAtom(vaultsAtom)

    const unlock = useCallback(async (password: string) => {

        try {
            setLoading(true)

            const vault = await __UNLOCK(password)

            const vaults = []
            for (let item of vault) {
                const vault = await __LOAD_VAULT(item.id)
                vaults.push(vault)
            }

            setVaults(vaults)

        } finally {
            setLoading(false)
        }

    }, [])

    return {
        unlock,
        loading: isLoading,
        vaults,
    }
}

export default useContext