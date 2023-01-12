import React, { FC, useMemo } from 'react'
import { CaretDown, DotsThree, Gear, Plus, Terminal } from 'phosphor-react'
import { usePty } from 'src/contexts'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import Image from 'next/image'
import { Center } from 'src/components'

const Component: FC = () => {

    const { shells, spawnPty } = usePty()
    const items = useMemo(() => {

        const items: MenuProps['items'] = shells.map((shell, index) => ({
            key: index,
            label: shell.display_name,
            icon: <Image height={14} width={14} src={shell.icon} alt='system-shell' />,
            onClick: () => spawnPty(shell),
        }))

        items.concat([
            { type: 'divider' },
            { key: 'settings', label: 'Settings', icon: <Gear size={14} /> },
        ])

        return items
    }, [shells])

    return (
        <Space.Compact>
            <Button
                icon={
                    <Center>
                        <Plus />
                    </Center>
                }
            />
            <Dropdown
                placement='bottomLeft'
                menu={{ items }}
                trigger={['click']}
            >
                <Button
                    icon={
                        <Center>
                            <CaretDown />
                        </Center>
                    }
                />
            </Dropdown>
        </Space.Compact>
    )
}

export default Component
