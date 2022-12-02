import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useVault } from 'src/contexts'
import type { FCWithChildren } from 'src/types'
import { Flex, LoadingOverlay } from '@mantine/core'

const Guard: FCWithChildren<{
    requireUnlockedVault: boolean
}> = ({ children, requireUnlockedVault }) => {

    const router = useRouter()
    const { loading, isVaultUnlocked } = useVault()

    useEffect(() => {

        if (!requireUnlockedVault || loading) {
            return
        }

        if (!isVaultUnlocked) {
            router.push('/auth/unlock')
                .catch(console.error)
            return
        }

    }, [])

    if (loading || (requireUnlockedVault && isVaultUnlocked === undefined)) {
        return (
            <Flex
                style={{ height: '100vh', width: '100vw' }}
                align='center'
                justify='center'
            >
                <LoadingOverlay visible={true} />
            </Flex>
        )
    }

    return <>{children}</>
}

export default Guard