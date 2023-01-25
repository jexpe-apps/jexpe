import React, { FC, useState } from 'react'
import { CaretDown, Plus } from 'phosphor-react'
import { useTerminal } from 'src/contexts'
import { Button, Modal, Space, Typography } from 'antd'
import Image from 'next/image'
import { Center, Flex } from 'src/components'

const Component: FC = () => {
    const { shells, spawnShell } = useTerminal()

    const [isModalOpen, setModalOpen] = useState(false)

    const closeModal = () => setModalOpen(false)
    const openModal = () => setModalOpen(true)

    return (
        <Space.Compact>
            <Button
                onClick={() => spawnShell(shells[0])}
                icon={
                    <Center>
                        <Plus />
                    </Center>
                }
            />

            <Modal title={null} closable={false} open={isModalOpen} footer={null} onCancel={closeModal}>
                <Flex direction="column" className="gap-2">
                    {shells.map((shell, index) => (
                        <Button
                            key={index}
                            onClick={() => {
                                closeModal()
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
                onClick={openModal}
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
