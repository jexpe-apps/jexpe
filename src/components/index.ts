import dynamic from 'next/dynamic'

export { default as Spinner } from './spinner'
export { default as TabManager } from './tab_manager'
export { default as Center } from './center'

export const SafeHydrate = dynamic(() => import('./safe_hydrate'), {
    ssr: false,
})
export const DynamicTerminal = dynamic(() => import('./xterm'), { ssr: false })
