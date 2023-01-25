import React, { FC, useCallback } from 'react'
import Link from 'next/link'
import { Button, theme, Typography, Modal } from 'antd'
import { Center, Flex } from 'src/components'
import { X } from 'phosphor-react'
import { useBoolean } from 'ahooks'

import type { ITabProps } from './types'

const Component: FC<ITabProps> = ({ href, label, icon, onClick, onClose, active }) => {
	const { token } = theme.useToken()

	const [state, { setTrue, setFalse }] = useBoolean(true)
	const [modal, contextHolder] = Modal.useModal()

	const getAccentColor = useCallback(() => {
		if (active) return token.colorPrimaryActive
		else if (state) return token.colorPrimaryHover
		else return token.colorBorder
	}, [active, state])

	const confirm = useCallback(() => {
		modal.confirm({
			title: 'Confirm',
			icon: null,
			content: <Typography.Paragraph type="secondary">Are you sure you want to close this tab?</Typography.Paragraph>,
			okText: 'Confirm',
			cancelText: 'Cancel',
			autoFocusButton: 'cancel',
			onOk: onClose,
		})
	}, [modal])

	return (
		<>
			<Link href={href} className="w-full">
				<Flex
					onMouseEnter={setTrue}
					onMouseLeave={setFalse}
					style={{
						backgroundColor: active ? token.colorBgElevated : token.colorBgContainer,
						border: `1px solid ${getAccentColor()}`,
						borderRadius: token.borderRadius,
						height: token.controlHeight - 2,
					}}
					onClick={onClick}
				>
					<div className="w-full flex items-center justify-between gap-[16px] px-2">
						{icon}

						<Typography.Text className="flex-grow w-0 text-start" ellipsis>
							{label}
						</Typography.Text>

						<Button type="text" size="small" onClick={confirm}>
							<Center>
								<X size={12} />
							</Center>
						</Button>
					</div>
				</Flex>
			</Link>
			{contextHolder}
		</>
	)
}

export default Component
