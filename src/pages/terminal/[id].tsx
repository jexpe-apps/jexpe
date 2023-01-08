import { NextPageWithLayout } from 'src/types'
import { DynamicTerminal } from 'src/components'
import { useRouter } from 'next/router'

const Page: NextPageWithLayout = () => {
    const {
        query: { id },
    } = useRouter()

    return <DynamicTerminal id={id as string} />
}

export default Page
