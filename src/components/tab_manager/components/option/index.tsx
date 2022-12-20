import React, { FC } from 'react'
import { CaretDown, Plus } from 'phosphor-react'
import { Menu } from '@headlessui/react'
import Image from 'next/image'

const WINDOWS_OS_SHELL = [
    {
        display_name: 'Windows PowerShell',
        icon: 'https://img.icons8.com/color/48/null/powershell.png',
        path: 'powershell.exe',
    },
    {
        display_name: 'Prompt dei comandi',
        icon: 'https://img.icons8.com/fluency/48/null/console.png',
        path: 'cmd.exe',
    },
    {
        display_name: 'Git Bash',
        icon: 'https://img.icons8.com/color/48/null/git.png',
        path: 'C:\\Program Files\\Git\\bin\\bash.exe',
    },
    {
        display_name: 'Ubuntu',
        icon: 'https://img.icons8.com/color/48/null/ubuntu--v1.png',
        path: 'wsl.exe',
    },
]

const Component: FC = () => {

    return (
        <Menu as='div' className='relative'>

            <div className='flex divide-x divide-dark-500'>

                <button className='py-1 px-2 rounded-l hover:bg-dark-500'>
                    <Plus size={16} weight='bold' />
                </button>

                <Menu.Button as='div'>
                    {({ open }) => (
                        <div className={`h-full py-1 px-2 rounded-r hover:bg-dark-500 ${open ? 'bg-dark-500' : ''}`}>
                            <CaretDown size={16} weight='bold' />
                        </div>
                    )}
                </Menu.Button>

            </div>

            <Menu.Items className='absolute shadow w-56 mt-2 left-8 bg-dark-700 rounded border border-dark-500 flex flex-col p-1 focus:outline-none'>

                {WINDOWS_OS_SHELL.map((shell, index) => (

                    <Menu.Item key={index}>
                        {({ active }) => (
                            <button className={`w-full rounded-md flex items-center gap-2 py-1 px-2 ${active ? 'bg-dark-500' : ''}`}>
                                <Image height={18} width={18} src={shell.icon} alt='os-shell' />
                                <p className='text-sm whitespace-nowrap'>{shell.display_name}</p>
                            </button>
                        )}
                    </Menu.Item>

                ))}

            </Menu.Items>

        </Menu>
    )
}

export default Component