import dynamic from 'next/dynamic'

export { default as Titlebar } from './titlebar'
export { default as Sidebar } from './sidebar'
export { default as Tabs } from './tab_manager'
export { default as Breadcrumb } from './breadcrumb'
export { default as Spinner } from './spinner'
export { default as TabManager } from './tab_manager'

export { default as VaultGroup } from './vault/group'
export { default as VaultHost } from './vault/host'

export const DynamicTerminal = dynamic(() => import('./xterm'), { ssr: false })