import { createContext, useContext, useState } from 'react'

import type { FCWithChildren } from 'src/types'
import type { ITab, ITabContext } from './types'

const TabContext = createContext<ITabContext>({
    tabs: [],
})

export const TabContextProvider: FCWithChildren = ({ children }) => {
    const [tabs] = useState<ITab[]>([])

    return <TabContext.Provider value={{ tabs }}>{children}</TabContext.Provider>
}

export const useTerminal = () => useContext(TabContext)
