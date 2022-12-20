import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { FC, ReactElement, ReactNode } from 'react'

export type LayoutFC = (page: ReactElement) => ReactNode

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: LayoutFC,
    protectedRoute?: boolean,
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout,
};

export type FCWithChildren<V = {}> = FC<{ children?: ReactNode } & V>

export type Maybe<T> = T | undefined
export type Nullable<T> = T | null

export interface IVault {
    id: string,
    display_name: string,
    description?: string,
    groups: IVaultGroup[],
    hosts: IVaultHost[],
}

export interface IVaultGroup {
    id: string,
    parent: Nullable<string>,
    display_name: string,
}

export interface IVaultHost {
    id: string,
    parent: Nullable<string>,
    display_name: string,
    hostname: string,
    services: IVaultHostService[],
}

export interface IVaultHostService {
    port: number,
    username: string,
    password?: string,
    id_rsa?: string,
}

export interface ITab {
}

