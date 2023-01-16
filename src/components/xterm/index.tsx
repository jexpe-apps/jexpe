import useResizeObserver from '@react-hook/resize-observer'
import { FC, useEffect, useMemo, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { usePty } from 'src/contexts'
import type { IXTermProps } from './types'

const Component: FC<IXTermProps> = ({ id }) => {
    const { ptys, writePty, resizePty } = usePty()

    const target = useRef<HTMLDivElement | null>(null)
    const fitAddon = useMemo(() => new FitAddon(), [])

    useEffect(() => {
        if (!target.current) {
            return
        }
        const index = ptys.findIndex((x) => x.id === id)
        if (index < 0) {
            return
        }

        const pty = ptys[index]

        pty.terminal.open(target.current)
        pty.terminal.focus()
        pty.terminal.loadAddon(fitAddon)

        const writeListener = pty.terminal.onData((data) => writePty(id, data))
        const resizeListener = pty.terminal.onResize((size) =>
            resizePty(id, {
                cols: size.cols,
                rows: size.rows,
                pixel_width: 0,
                pixel_height: 0,
            })
        )

        fitAddon.fit()

        return () => {
            writeListener.dispose()
            resizeListener.dispose()
        }
    }, [target, id, ptys, fitAddon, writePty, resizePty])

    useResizeObserver(target, () => {
        const dimensions = fitAddon.proposeDimensions()
        if (!dimensions) {
            return
        }

        resizePty(id, {
            cols: dimensions.cols,
            rows: dimensions.rows,
            pixel_width: 0,
            pixel_height: 0,
        })

        fitAddon.fit()
    })

    return <div key={id} ref={target} style={{ overflow: 'hidden', height: '100%', width: '100%' }} />
}

export default Component
// export default dynamic(() => Promise.resolve(Component), { ssr: false })
