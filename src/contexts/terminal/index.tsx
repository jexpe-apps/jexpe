import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { useRouter } from 'next/router'

import { GET_SYSTEM_SHELLS_COMMAND, PTY_EXIT_EVENT, PTY_KILL_COMMAND, PTY_RESIZE_COMMAND, PTY_SPAWN_COMMAND, PTY_SPAWN_EVENT, PTY_STDIN_COMMAND, PTY_STDOUT_EVENT } from './constants'

import type { FCWithChildren } from 'src/types'
import type { ITerminal, ITerminalContext, IPTYSpawnPayload, IPTYExitPayload, IPTYSdoutPayload, ISystemShell, IPtySize } from './types'

const TerminalContext = createContext<ITerminalContext>({
	shells: [],
	spawnPty: () => undefined,
	killPty: () => undefined,
	terminals: [],
	focused: undefined,
	focus: () => undefined,
})

export const TerminalContextProvider: FCWithChildren = ({ children }) => {
	const [shells, setShells] = useState<ISystemShell[]>([])
	const [terminals, setTerminals] = useState<ITerminal[]>([])
	const [focused, setFocused] = useState<string | undefined>(undefined)

	const router = useRouter()

	const spawnPty = useCallback((shell: ISystemShell) => {
		invoke(PTY_SPAWN_COMMAND, { shell }).catch(console.error)
	}, [])

	const writePty = useCallback((id: string, data: string) => {
		invoke(PTY_STDIN_COMMAND, { id, data })
			// TODO: Handle errors properly
			.catch(console.error)
	}, [])

	const resizePty = useCallback((id: string, size: IPtySize) => {
		invoke(PTY_RESIZE_COMMAND, { id, size })
			// TODO: Handle errors properly
			.catch(console.error)
	}, [])

	const updateTitle = useCallback(
		(id: string, title: string) => {
			setTerminals((terminals) => {
				const index = terminals.findIndex((x) => x.id === id)
				if (index < 0) {
					// This should never happen, but just to be on the safe side
					console.error(`[TITLE-LISTENER] Could not find terminal with id ${id}`)
					return terminals
				}

				terminals[index].title = title
				return [...terminals]
			})
		},
		[terminals]
	)

	const killPty = useCallback((id: string) => {
		invoke(PTY_KILL_COMMAND, { id })
			// TODO: Handle errors properly
			.catch(console.error)
	}, [])

	useEffect(() => {
		invoke<ISystemShell[]>(GET_SYSTEM_SHELLS_COMMAND, {}).then(setShells).catch(console.error)
	}, [])

	useEffect(() => {
		const spawnListener = listen<IPTYSpawnPayload>(PTY_SPAWN_EVENT, ({ payload }) => {
			const { id, shell } = payload

			// Dynamically import xterm to ensure it's only loaded client-side
			import('xterm')
				.then(({ Terminal }) => {
					// Create a new xterm instance
					const xterm = new Terminal({
						// TODO: Add possibility to customize theme
						theme: {
							background: '#1A1B1E',
							cursor: '#10B981',
							cursorAccent: '#10B98100',
						},
						fontFamily: 'Cascadia Mono, MesloLGS NF, Monospace',
						fontWeight: 'normal',
						fontSize: 14,
						cursorBlink: true,
						allowTransparency: true,
						allowProposedApi: true,
						overviewRulerWidth: 8,
					})

					xterm.onData((data) => writePty(id, data))
					xterm.onResize((size) =>
						resizePty(id, {
							...size,
							// TODO: Retrieve char width and height
							pixel_width: 0,
							pixel_height: 0,
						})
					)
					xterm.onTitleChange((title) => updateTitle(id, title))

					// Add the terminal to the context
					setTerminals((terminals) => [...terminals, { id, shell, title: shell.name, xterm }])

					// Focus the new terminal
					setFocused(id)

					if (router.asPath !== '/terminal') {
						void router.push('/terminal')
					}
				})
				// TODO: Maybe kill pty, just to be on the safe side (?)
				.catch(console.error)
		})

		const stdoutListener = listen<IPTYSdoutPayload>(PTY_STDOUT_EVENT, ({ payload }) => {
			const { id, bytes } = payload

			// Find the terminal with the given id
			const terminal = terminals.find((terminal) => terminal.id === id)
			if (!terminal) {
				// TODO: Maybe kill pty, just to be on the safe side (?)
				console.error(`[STDOUT-LISTENER] Could not find terminal with id ${id}`)
				return
			}

			// Write the bytes to the xterm instance
			terminal.xterm.write(bytes)
		})

		const exitListener = listen<IPTYExitPayload>(PTY_EXIT_EVENT, ({ payload }) => {
			const { id, success, code } = payload

			// Find the terminal with the given id
			const index = terminals.findIndex((terminal) => terminal.id === id)
			if (index < 0) {
				// This should never happen, but just to be on the safe side
				console.error(`[EXIT-LISTENER] Could not find terminal with id ${id}`)
				setFocused(undefined)
				return
			}

			// TODO: Handle `success` and `code` properly
			void success
			void code

			setTerminals((terminals) => {
				// Focus the next terminal in the array
				const toFocus = terminals.at(index + 1) ?? terminals.at(index - 1)
				setFocused(toFocus?.id)

				// Remove the terminal from the array
				terminals.splice(index, 1)
				return [...terminals]
			})
		})

		return () => {
			spawnListener.then((unlisten) => unlisten()).catch(console.error)

			stdoutListener.then((unlisten) => unlisten()).catch(console.error)

			exitListener.then((unlisten) => unlisten()).catch(console.error)
		}
	}, [terminals])

	return (
		<TerminalContext.Provider
			value={{
				shells,
				spawnPty,
				killPty,
				terminals,
				focused,
				focus: setFocused,
			}}
		>
			{children}
		</TerminalContext.Provider>
	)
}

export const useTerminal = () => useContext(TerminalContext)
