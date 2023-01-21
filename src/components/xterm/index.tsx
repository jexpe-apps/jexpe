import { FC, useEffect, useMemo, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { useSize } from 'ahooks'

import type { ITerminal } from 'src/contexts/terminal/types'

const Component: FC<{ terminal: ITerminal; focused: boolean }> = ({ terminal, focused }) => {
    const target = useRef<HTMLDivElement | null>(null)

    const fitAddon = useMemo(() => new FitAddon(), [])
    const size = useSize(target)

    useEffect(() => {
        if (!focused) {
            return
        }

        fitAddon.fit()
    }, [size, focused])

    useEffect(() => {
        terminal.xterm.focus()

        return () => terminal.xterm.blur()
    }, [focused])

    useEffect(() => {
        if (!target.current) {
            return
        }

        terminal.xterm.open(target.current)
        terminal.xterm.focus()

        // Activate the xtermjs fit-addon
        terminal.xterm.loadAddon(fitAddon)
        fitAddon.activate(terminal.xterm)

        fitAddon.fit()

        return () => {
            // TODO: Destroy terminal and kill pty
        }
    }, [])

    return <div ref={target} className="h-full w-full overflow-hidden" style={{ display: focused ? 'flex' : 'none' }} />
}

export default Component
