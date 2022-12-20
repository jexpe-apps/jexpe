import React, { FC, useMemo } from 'react'
import Link from 'next/link'
import { House } from 'phosphor-react'
import { useRouter } from 'next/router'

const Component: FC = () => {

    const router = useRouter()
    const isActive = useMemo(() => router.pathname === '/', [router.pathname])

    return (
        <Link href='/' className='h-full flex items-center justify-center mr-2 px-3 bg-dark-700 border border-dark-500 rounded hover:border-dark-300 hover:bg-dark-500'>
            <House size={16} weight='duotone' className={`${isActive ? 'text-brand-700' : ''}`} />
        </Link>
    )
}

export default Component