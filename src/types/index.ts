import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { FC, ReactElement, ReactNode } from 'react'
import type { Terminal } from 'xterm'

export type LayoutFC = (page: ReactElement) => ReactNode

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: LayoutFC
    protectedRoute?: boolean
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export type FCWithChildren<V = object> = FC<{ children?: ReactNode } & V>

export type Maybe<T> = T | undefined
export type Nullable<T> = T | null

export interface ISystemShell {
    display_name: string
    icon: string
    command: string
    directory: string
}

export interface IPtySize {
    rows: number
    cols: number
    pixel_width: number
    pixel_height: number
}

export interface IPty {
    id: string
    shell: ISystemShell
    terminal?: Terminal
}
