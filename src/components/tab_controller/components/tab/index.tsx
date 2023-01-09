import React, { FC, useMemo } from 'react'
import { X } from 'phosphor-react'
import Link from 'next/link'
import { Button, theme, Typography } from 'antd'
import type { ITabProps } from './types'
import { useRouter } from 'next/router'

const Component: FC<ITabProps> = ({ href, label, icon, onClose, dragging }) => {
    const { token } = theme.useToken()

    const router = useRouter()

    const active = useMemo(
        () => router.asPath === href || dragging,
        [dragging, router.asPath]
    )

    return (
        <Link href={href} className="w-full">
            <Button
                className="w-full flex items-center justify-between gap-[16px]"
                type={active ? 'primary' : 'default'}
                ghost={active}
                icon={icon}
                style={{
                    paddingRight: 4,
                    pointerEvents: 'none',
                    backgroundColor: active
                        ? token.colorBgElevated
                        : token.colorBgContainer,
                }}
            >
                <Typography.Text className="flex-grow w-0 text-start" ellipsis>
                    {label}
                </Typography.Text>

                <Button type="text" size="small">
                    <X onClick={onClose} size={12} />
                </Button>
            </Button>
        </Link>
    )
}

export default Component
