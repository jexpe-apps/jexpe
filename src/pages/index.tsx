import { Button, Typography } from 'antd'
import { NextPageWithLayout } from 'src/types'

const Page: NextPageWithLayout = () => {
    return (
        <div className="p-5 h-full flex flex-col gap-5">
            <Typography.Title className="text-3xl font-bold">
                Homepage
            </Typography.Title>
            <Button type="primary">Test</Button>
        </div>
    )
}

export default Page
