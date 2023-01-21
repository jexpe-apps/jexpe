import { Typography } from 'antd'
import { Flex } from 'src/components'
import { NextPageWithLayout } from 'src/types'

const Page: NextPageWithLayout = () => {
    return (
        <Flex className="h-full w-full bg-dark-600">
            <Typography.Title>Homepage</Typography.Title>
        </Flex>
    )
}

export default Page
