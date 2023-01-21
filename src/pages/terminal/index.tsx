import { useTerminal } from 'src/contexts'
import { XTerm } from 'src/components'

import type { NextPageWithLayout } from 'src/types'

const Terminal: NextPageWithLayout = () => {
    const { terminals, focused } = useTerminal()

    return (
        <>
            {terminals.map((terminal, index) => (
                <XTerm key={index} terminal={terminal} focused={focused === terminal.id} />
            ))}
        </>
    )
}

export default Terminal
