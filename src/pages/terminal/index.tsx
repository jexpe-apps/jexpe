import { useTerminal } from 'src/contexts'
import { Flex, XTerm } from 'src/components'

import type { NextPageWithLayout } from 'src/types'

const Terminal: NextPageWithLayout = () => {

    const { terminals, focused, focus } = useTerminal()

    return (
        <>
            <Flex className='gap-2'>
                {terminals.map((terminal, index) => (
                    <button key={index} onClick={() => focus(terminal.id)}>
                        {terminal.title}
                    </button>
                ))}
            </Flex>

            {terminals.map((terminal, index) => (
                <XTerm key={index} terminal={terminal} focused={focused === terminal.id} />
            ))}
        </>
    )

}

export default Terminal
