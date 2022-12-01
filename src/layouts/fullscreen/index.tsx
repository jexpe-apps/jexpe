import { Flex } from '@mantine/core'
import { LayoutFC } from 'src/types'

const Layout: LayoutFC = (page) => {
    return (
        <Flex
            style={{ height: '100vh', width: '100vw' }}
            align="center"
            justify="center"
        >
            {page}
        </Flex>
    )
}

export default Layout
