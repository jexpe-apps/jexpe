import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import type { ITab, Maybe } from 'src/types'

const tabsAtom = atom<Maybe<ITab[]>>(undefined)

const useContext = () => {

    const [isLoading, setLoading] = useState(true)
    const [tabs, setTabs] = useAtom(tabsAtom)

    useEffect(() => {

        try {
            setLoading(true)



        } finally {
            setLoading(false)
        }

    }, [])

    return {
        loading: isLoading,
        tabs,
    }
}

export default useContext


