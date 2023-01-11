import { LayoutFC } from 'src/types'
import { Flex, TabController } from 'src/components'

const Layout: LayoutFC = (page) => {
    return (
        <Flex className='h-screen w-screen' direction='column'>
            <TabController />
            {page}
        </Flex>
    )
}

export default Layout
