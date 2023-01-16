import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { FC, ReactElement, ReactNode } from 'react'

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
