import Link from 'next/link'
import { CaretRight } from 'phosphor-react'
import { FC } from 'react'
import { IVault } from 'src/types'

const Component: FC<{
    vault: IVault
}> = ({ vault }) => {

    return (
        <Link href={`/vault/${encodeURIComponent(vault.id)}`}>
            <div className='cursor-pointer rounded bg-primary-700 hover:bg-primary-500 group border border-primary-500 flex flex-col'>
                <div className='h-full w-full p-2 pb-8 gap-2'>
                    <p className='font-medium text-lg'>{vault.display_name}</p>
                    <p className='text-xs font-light text-secondary-200'>{vault.description}</p>
                </div>

                <div className='flex gap-2 items-center border-t border-primary-500 group-hover:border-primary-300 p-2'>
                    <p className='whitespace-nowrap text-xs font-light text-secondary-200'>
                        <strong>{vault.hosts.length}</strong> items
                    </p>
                    <div className='w-full transition duration-300 ease-in-out group-hover:translate-x-[calc(100%-24px)]'>
                        <CaretRight size={12} className='text-brand' />
                    </div>
                </div>
            </div>
        </Link>
    )

}

export default Component