import { FCWithChildren } from 'src/types'
import { Flex } from 'src/components'

const Component: FCWithChildren = ({ children }) => (
    <Flex align='center' justify='center'>
        {children}
    </Flex>
)

export default Component
