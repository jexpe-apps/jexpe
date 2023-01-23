import { FC, useEffect, useMemo, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { useSize } from 'ahooks'
import { Unicode11Addon } from 'xterm-addon-unicode11'
import { WebglAddon } from 'xterm-addon-webgl'
// import { LigaturesAddon } from 'xterm-addon-ligatures'
// import { ImageAddon } from 'xterm-addon-image'
import { WebLinksAddon } from 'xterm-addon-web-links'

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

		// Activate xtermjs unicode11-addon
		terminal.xterm.loadAddon(new Unicode11Addon())
		terminal.xterm.unicode.activeVersion = '11'

		// Activate the xtermjs webgl-addon
		terminal.xterm.loadAddon(new WebglAddon())

		// Activate the xtermjs image-addon
		// terminal.xterm.loadAddon(new ImageAddon())

		// Activate the xtermjs font-ligatures-addon
		// terminal.xterm.loadAddon(new LigaturesAddon())

		// Activate the xtermjs web-links-addon
		terminal.xterm.loadAddon(new WebLinksAddon())

		fitAddon.fit()

		return () => {
			// TODO: Destroy terminal and kill pty
		}
	}, [])

	return <div ref={target} className="h-full w-full overflow-hidden" style={{ display: focused ? 'flex' : 'none' }} />
}

export default Component
