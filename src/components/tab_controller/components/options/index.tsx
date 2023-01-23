import React, { FC, useState } from 'react'
import { CaretDown, Plus } from 'phosphor-react'
import { useTerminal } from 'src/contexts'
import { Button, Modal, Space, Typography } from 'antd'
import Image from 'next/image'
import { Center, Flex } from 'src/components'

const Component: FC = () => {
    const { shells, spawnShell } = useTerminal()
    
    const [open, setOpen] = useState(false)

    const showModal = () => {
        setOpen(true)
    }

    const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e)
        setOpen(false)
    }

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        console.log(e)
        setOpen(false)
    }

    return (
        <Space.Compact>
            <Button
                icon={
                    <Center>
                        <Plus />
                    </Center>
                }
            />
            
            <Modal title="Select profile" open={open} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <Flex direction="column" className="gap-2">
                    {shells.map((shell, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                setOpen(false)
                                spawnShell(shell)
                            }}
                            className="w-full flex items-center gap-2"
                            type="text"
                        >
                            <Image height={20} width={20} src={shell.icon} alt="system-shell" />
                            <Typography.Text>
                                {shell.name} <span className="text-gray-600">({shell.command})</span>
                            </Typography.Text>
                        </Button>
                    ))}
                </Flex>
            </Modal>

            <Button
                onClick={showModal}
                icon={
                    <Center>
                        <CaretDown />
                    </Center>
                }
            />
        </Space.Compact>
    )
}

export default Component
