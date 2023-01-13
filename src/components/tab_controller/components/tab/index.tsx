import React, { FC } from 'react'
import { X } from 'phosphor-react'
import Link from 'next/link'
import { Button, theme, Typography } from 'antd'
import type { ITabProps } from './types'

const Component: FC<ITabProps> = ({ href, label, icon, onClick, onClose, active, dragging }) => {
    const { token } = theme.useToken()

    return (
        <Link href={href} className="w-full">
            <Button
                className="w-full flex items-center justify-between gap-[16px]"
                type={active ? 'primary' : 'default'}
                ghost={active}
                icon={icon}
                style={{
                    paddingRight: 4,
                    backgroundColor: active ? token.colorBgElevated : token.colorBgContainer,
                }}
                onClick={onClick}
            >
                <Typography.Text className="flex-grow w-0 text-start" ellipsis>
                    {label}
                </Typography.Text>

                {/*<Button type="text" size="small">*/}
                {/*    <X onClick={onClose} size={12} />*/}
                {/*</Button>*/}
            </Button>
        </Link>
    )
}

export default Component
