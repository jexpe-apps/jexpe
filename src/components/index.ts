import dynamic from 'next/dynamic'

export { default as Spinner } from './spinner'
export { default as TabManager } from './tab_manager'
export { default as SafeHydrate } from './safe_hydrate'
export const DynamicTerminal = dynamic(() => import('./xterm'), { ssr: false })
