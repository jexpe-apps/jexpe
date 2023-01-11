import dynamic from 'next/dynamic'

export { default as Flex } from './flex'
export { default as Center } from './center'
export { default as TabController } from './tab_controller'

export const DynamicTerminal = dynamic(() => import('./xterm'), { ssr: false })