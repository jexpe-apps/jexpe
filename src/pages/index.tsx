import { IVaultGroup, NextPageWithLayout } from 'src/types'
import { useLocalVault } from 'src/contexts'
import React, { useMemo, useState } from 'react'
import { VaultGroup, VaultHost } from 'src/components'
import { Stack } from 'phosphor-react'

const Page: NextPageWithLayout = () => {

    // const { vault } = useLocalVault()

    // const [parent, setParent] = useState<IVaultGroup | undefined>(undefined)
    // const parentTree = useMemo(() => {
    //
    //     const tree: (IVaultGroup | undefined)[] = []
    //
    //     let current = parent
    //     while (current) {
    //         tree.push(current)
    //         current = vault?.groups.find(g => g.id == current?.parent)
    //     }
    //
    //     if (tree.length > 0) {
    //         tree.push(undefined)
    //     }
    //
    //     return tree.reverse()
    //
    // }, [vault, parent])
    //
    // const groups = useMemo(() => {
    //     return vault?.groups.filter(g => g.parent == parent?.id)
    // }, [vault, parent])
    // const hosts = useMemo(() => {
    //     return vault?.hosts.filter(h => h.parent == parent?.id)
    // }, [vault, parent])

    return (
        <div className='p-5 h-full flex flex-col gap-5'>


            <div className='flex flex-col gap-2'>

                <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <p className='text-2xl font-medium'>Groups</p>
                        {/*{parentTree.length > 0 && (*/}
                        {/*    <>*/}
                        {/*        <span>(</span>*/}
                        {/*        <Breadcrumbs>*/}
                        {/*            {parentTree.map((group, index) => (*/}
                        {/*                <p key={index} className='text-sm hover:text-brand-700'*/}
                        {/*                   onClick={() => setParent(group)}>*/}
                        {/*                    {group === undefined ? (*/}
                        {/*                        <Stack size={12} weight='duotone' />*/}
                        {/*                    ) : (group.display_name)}*/}
                        {/*                </p>*/}
                        {/*            ))}*/}
                        {/*        </Breadcrumbs>*/}
                        {/*        <span>)</span>*/}
                        {/*    </>*/}
                        {/*)}*/}
                    </div>
                    <hr className='border-dark-500' />
                </div>
                {/*<div className='grid grid-cols-4 gap-2'>*/}

                {/*    {groups.length > 0 && groups.map((group) => (*/}
                {/*        <VaultGroup group={group} onClick={() => setParent(group)} />*/}
                {/*    ))}*/}

                {/*    {groups.length <= 0 && (*/}
                {/*        <div>*/}
                {/*            // TODO: Add illustration for creating a new group*/}
                {/*        </div>*/}
                {/*    )}*/}

                {/*</div>*/}

            </div>

            <div className='flex flex-col gap-2'>

                <div className='flex flex-col'>
                    <p className='text-2xl font-medium'>Hosts</p>
                    <hr className='border-dark-500' />
                </div>
                {/*<div className='grid grid-cols-4 gap-2'>*/}

                {/*    {hosts.length > 0 && hosts.map((host) => (*/}
                {/*        <VaultHost host={host} />*/}
                {/*    ))}*/}

                {/*    {hosts.length <= 0 && (*/}
                {/*        <div>*/}
                {/*            // TODO: Add illustration for creating a new host*/}
                {/*        </div>*/}
                {/*    )}*/}

                {/*</div>*/}

            </div>

        </div>
    )
}

export default Page
