import { Typography } from 'antd'
import { Flex } from 'src/components'
import { NextPageWithLayout } from 'src/types'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Page: NextPageWithLayout = () => {

    const router = useRouter()

    useEffect(() => void router.push('/terminal'), [])

    return (
        <Flex className='h-full w-full bg-dark-600'>
            <Typography.Title>Homepage</Typography.Title>
        </Flex>
    )
}

export default Page
