import { UniqueObject } from 'src/types'

export interface ITab extends UniqueObject {
    position: number
    title: string
    href: string
    icon?: string
}

export interface ITabContext {
    tabs: ITab[]
}
