import dynamic from 'next/dynamic'

export { default as Sidebar } from './sidebar'
export { default as Vault } from './vault'
export { default as Tabs } from './tabs'
export { default as Breadcrumb } from './breadcrumb'
export { default as Spinner } from './spinner'

export const DynamicTerminal = dynamic(() => import('./xterm'), { ssr: false })