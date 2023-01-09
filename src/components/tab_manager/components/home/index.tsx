import React, { FC, useMemo } from 'react'
import Link from 'next/link'
import { House } from 'phosphor-react'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import { Center } from 'src/components'

const Component: FC = () => {
    const router = useRouter()
    const isActive = useMemo(() => router.pathname === '/', [router.pathname])

    return (
        <Button>
            <Center>
                <House size={16} weight="duotone" />
            </Center>
        </Button>
    )
}

export default Component
