import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight, HardDrives, HouseSimple } from 'phosphor-react'
import { useMemo } from 'react'
import { Breadcrumb } from 'src/components'
import { useVault } from 'src/contexts'
import { NextPageWithLayout } from 'src/types'

const Vault: NextPageWithLayout = () => {

    const router = useRouter()
    const { vaults } = useVault()

    const vault = useMemo(
        () => vaults?.find(x => x.id === router.query.id),
        [router, vaults],
    )

    return (
        <div className='h-full w-full flex flex-col p-10 gap-5'>

            <div className='flex flex-col gap-2'>
                <Breadcrumb root={
                    <Link href='/' className='text-gray-400 hover:text-gray-500'>
                        <HouseSimple weight='duotone' className='h-5 w-5 flex-shrink-0' />
                    </Link>
                } routes={[
                    { name: vault!.display_name, href: '/', current: false },
                    { name: 'Hosts', href: '/', current: true },
                ]} />
                <hr className='border-primary-500' />
            </div>

            <div className='grid grid-cols-3 gap-5'>
                {vault?.hosts.map((host, index) => (

                    <Link href='/tab/djfhsjfhsjfh' key={index}
                         className='cursor-pointer rounded bg-primary-700 hover:bg-primary-500 group border border-primary-500 flex flex-col'>

                        <div className='h-full w-full flex p-2 gap-2 items-center'>
                            <HardDrives size={24} weight='duotone' className='text-brand' />
                            <p className='font-medium text-lg'>{host.display_name}</p>
                        </div>

                        <div
                            className='flex gap-2 items-center border-t border-primary-500 group-hover:border-primary-300 p-2'>
                            <p className='whitespace-nowrap text-xs font-light text-secondary-200'>
                                <strong>{host.services.length}</strong> services
                            </p>
                            <div
                                className='w-full transition duration-300 ease-in-out group-hover:translate-x-[calc(100%-24px)]'>
                                <CaretRight size={12} className='text-brand' />
                            </div>
                        </div>

                    </Link>

                ))}
            </div>

        </div>
    )
}

export default Vault