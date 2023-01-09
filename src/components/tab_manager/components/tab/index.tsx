import React, { FC, useMemo } from 'react'
import { X } from 'phosphor-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, theme, Typography } from 'antd'
import { useRouter } from 'next/router'
import { Center } from 'src/components'

const Component: FC<{
    id: string
    href: string
    title: string
    icon: string
    onClose: (id: string) => void
    dragging?: boolean
}> = ({ id, href, title, icon, onClose, dragging }) => {
    const { token } = theme.useToken()
    const router = useRouter()
    const active = useMemo(
        () => router.asPath === `/terminal/${id}`,
        [router.asPath]
    )

    return (
        <Link href={href}>
            <Button
                className="flex w-full h-full items-center px-2"
                style={{
                    backgroundColor: active
                        ? token.colorBgSpotlight
                        : undefined,
                }}
                icon={
                    <Center>
                        <Image src={icon} alt="icon" width={16} height={16} />
                    </Center>
                }
            >
                <Typography.Text className="flex-grow w-0" ellipsis>
                    {title}
                </Typography.Text>

                <Button type="text" size="small">
                    <X onClick={() => onClose(id)} size={12} />
                </Button>
            </Button>
        </Link>
    )
}

export default Component
