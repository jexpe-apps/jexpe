import { FC, useEffect, useMemo, useRef } from 'react'
import { FitAddon } from 'xterm-addon-fit'
import { useSize } from 'ahooks'
import { Unicode11Addon } from 'xterm-addon-unicode11'
import { CanvasAddon } from 'xterm-addon-canvas'
// import { WebglAddon } from 'xterm-addon-webgl'
// import { LigaturesAddon } from 'xterm-addon-ligatures'
// import { ImageAddon } from 'xterm-addon-image'
import { WebLinksAddon } from 'xterm-addon-web-links'

import type { ITerminal } from 'src/contexts/terminal/types'

const Component: FC<{ terminal: ITerminal; focused: boolean }> = ({ terminal, focused }) => {
	const target = useRef<HTMLDivElement | null>(null)
	const targetSize = useSize(target)

	const addons = useMemo(
		() => ({
			resize: new FitAddon(),
			render: new CanvasAddon(), // TODO: user.config.renderMode === 'CANVAS' ? new CanvasAddon() : new WebglAddon(),
			webLinks: new WebLinksAddon(),
			unicode11: new Unicode11Addon(),
			// ligaturesAddon: new LigaturesAddon(),
			// imageAddon: new ImageAddon(),
		}),
		[]
	)

	useEffect(() => {
		if (!focused) {
			return
		}

		addons.resize.fit()
	}, [targetSize, focused])

	useEffect(() => {
		terminal.xterm.focus()
		return () => terminal.xterm.blur()
	}, [focused])

	useEffect(() => {
		if (!target.current) {
			return
		}

		console.log('mounting terminal', terminal.id)

		terminal.xterm.open(target.current)
		terminal.xterm.focus()

		// Activate the xtermjs addons
		Object.values(addons).forEach((addon) => {
			terminal.xterm.loadAddon(addon)
			addon.activate(terminal.xterm)
		})

		// Extra configurations for xtermjs addons
		terminal.xterm.unicode.activeVersion = '11'

		return () => {
			Object.values(addons).forEach((x) => x.dispose())
			terminal.xterm.dispose()
		}
	}, [])

	return <div ref={target} className="h-full w-full overflow-hidden" style={{ display: focused ? 'flex' : 'none' }} />
}

export default Component
