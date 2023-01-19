import { NextPageWithLayout } from 'src/types'
import { Center, XTerm } from 'src/components'
import { usePty } from 'src/contexts'

const Terminal: NextPageWithLayout = () => {
    const { currentPty } = usePty()

    if (!currentPty) {
        return (
            <Center>
                <h1>Terminal not found</h1>
            </Center>
        )
    }

    return <XTerm id={currentPty} />
}

export default Terminal
