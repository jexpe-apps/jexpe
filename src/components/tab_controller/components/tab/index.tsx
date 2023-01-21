import React, { FC, useCallback, useState } from 'react'
import Link from 'next/link'
import { Button, theme, Typography } from 'antd'
import type { ITabProps } from './types'
import { Center, Flex } from 'src/components'
import { X } from 'phosphor-react'

const Component: FC<ITabProps> = ({ href, label, icon, onClick, active }) => {
    const { token } = theme.useToken()

    const [isHover, setIsHover] = useState(false)

    const getBorderColor = useCallback(() => {
        if (active) return token.colorPrimaryActive
        else if (isHover) return token.colorPrimaryHover
        else return token.colorBorder
    }, [active, isHover])

    return (
        <Link href={href} className="w-full">
            <Flex
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    backgroundColor: active ? token.colorBgElevated : token.colorBgContainer,
                    border: `1px solid ${getBorderColor()}`,
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

                    <Button type="text" size="small">
                        <Center>
                            <X size={12} />
                        </Center>
                    </Button>
                </div>
            </Flex>
        </Link>
    )
}

export default Component
