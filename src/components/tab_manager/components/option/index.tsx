import React, { FC } from 'react'
import { CaretDown, DotsThree, Gear, Plus, Terminal } from 'phosphor-react'
import { useShell } from 'src/contexts'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import Image from 'next/image'

const Component: FC = () => {
    const { shells, spawnShell } = useShell()

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('click left button', e)
    }

    const items: MenuProps['items'] = shells.map((shell, index) => ({
        key: index,
        label: shell.display_name,
        icon: <Image height={14} width={14} src={shell.icon} alt="os-shell" />,
        onClick: () => spawnShell(shell),
    }))

    const menuProps = {
        items: items.concat([
            { type: 'divider' },
            { key: 'settings', label: 'Settings', icon: <Gear /> },
        ]),
        onClick: () => {
            console.log('click')
        },
    }

    return (
        <Space.Compact block>
            <Button
                icon={
                    <div className="flex items-center justify-center">
                        <Plus />
                    </div>
                }
            />
            <Dropdown
                placement="bottomLeft"
                menu={menuProps}
                trigger={['click']}
            >
                <Button
                    icon={
                        <div className="flex items-center justify-center">
                            <CaretDown />
                        </div>
                    }
                />
            </Dropdown>
        </Space.Compact>
    )

    // return (
    //     <Menu as="div" className="relative">
    //         <div className="flex divide-x divide-dark-500">
    //             <button className="py-1 px-2 rounded-l hover:bg-dark-500">
    //                 <Plus size={16} weight="bold" />
    //             </button>

    //             <Menu.Button as="div">
    //                 {({ open }) => (
    //                     <div
    //                         className={`h-full py-1 px-2 rounded-r hover:bg-dark-500 ${
    //                             open ? 'bg-dark-500' : ''
    //                         }`}
    //                     >
    //                         <CaretDown size={16} weight="bold" />
    //                     </div>
    //                 )}
    //             </Menu.Button>
    //         </div>

    //         <Menu.Items className="absolute z-10 shadow w-56 mt-2 left-8 bg-dark-700 rounded border border-dark-500 flex flex-col p-1 focus:outline-none">
    //             {shells.map((shell, index) => (
    //                 <Menu.Item key={index}>
    //                     {({ active }) => (
    //                         <button
    //                             onClick={() => spawnShell(shell)}
    //                             className={`w-full rounded-md flex items-center gap-2 py-1 px-2 ${
    //                                 active ? 'bg-dark-500' : ''
    //                             }`}
    //                         >
    //                             <Image
    //                                 height={18}
    //                                 width={18}
    //                                 src={shell.icon}
    //                                 alt="os-shell"
    //                             />
    //                             <p className="text-sm whitespace-nowrap">
    //                                 {shell.display_name}
    //                             </p>
    //                         </button>
    //                     )}
    //                 </Menu.Item>
    //             ))}
    //         </Menu.Items>
    //     </Menu>
    // )
}

export default Component
