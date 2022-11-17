import { IconLoader } from '@supabase/ui'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useVault } from 'src/contexts'
import type { FCWithChildren } from 'src/types'

const Guard: FCWithChildren<{
    authRequired: boolean
}> = ({ children, authRequired }) => {

    const router = useRouter()
    const { loading, vaults } = useVault()

    useEffect(() => {

        if (!authRequired || loading) {
            return
        }

        if (!vaults) {
            router.push('/auth/unlock')
            return
        }

    }, [])

    if (loading || (authRequired && !vaults)) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <IconLoader className='animate-spin text-brand' />
            </div>
        )
    }

    return <>{children}</>
}

export default Guard