import React, { FC } from 'react'
import { X } from 'phosphor-react'
import Image from 'next/image'
import Link from 'next/link'

const Component: FC<{
    id: string
    href: string
    title: string
    icon: string
    onClose: (id: string) => void
    dragging?: boolean
}> = ({ id, href, title, icon, onClose, dragging }) => {
    return (
        <Link
            href={href}
            className={`flex mr-2 items-center border border-dark-500 py-1 px-2 justify-between rounded w-[256px] ${
                dragging ? 'shadow border-dark-300 bg-dark-500' : 'bg-dark-700'
            }`}
        >
            <div className="flex items-center gap-2">
                <Image src={icon} alt="icon" width={16} height={16} />
                <p className="text-xs">{title}</p>
            </div>

            <button className="p-1 hover:bg-dark-500 hover:text-brand-red rounded flex items-center justify-center">
                <X onClick={() => onClose(id)} size={12} />
            </button>
        </Link>
    )
}

export default Component
