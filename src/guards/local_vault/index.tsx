import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useLocalVault } from 'src/contexts'
import type { FCWithChildren } from 'src/types'
import { Spinner } from 'src/components'

const Guard: FCWithChildren<{
    protectedRoute: boolean
}> = ({ children, protectedRoute }) => {

    const router = useRouter()
    const { loading, token } = useLocalVault()

    // useEffect(() => {
    //
    //     if (!protectedRoute) {
    //         return
    //     }
    //
    //     if (loading) {
    //         return
    //     }
    //
    //     if (token === undefined) {
    //         router.push('/auth/unlock')
    //             .catch(console.error)
    //     }
    //
    // }, [])
    //
    // if (protectedRoute && token === undefined) {
    //     return (
    //         <div className='h-screen flex items-center justify-center'>
    //             <Spinner />
    //         </div>
    //     )
    // }

    return <>{children}</>
}

export default Guard