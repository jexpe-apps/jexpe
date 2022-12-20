import React, { FC } from 'react'
import { X } from 'phosphor-react'
import Image from 'next/image'

const Component: FC<{
    tab: any
    dragging?: boolean
}> = ({ tab, dragging }) => {

    return (
        <div
            className={`flex mr-2 items-center border border-dark-500 py-1 px-2 justify-between rounded w-[256px] ${dragging ? 'shadow border-dark-300 bg-dark-500' : 'bg-dark-700'}`}>

            <div className='flex items-center gap-2'>
                <Image src={tab.icon} alt='icon' width={16} height={16} />
                <p className='text-xs'>{tab.display_name}</p>
            </div>

            <button className='p-1 hover:bg-dark-500 hover:text-brand-red rounded flex items-center justify-center'>
                <X size={12} />
            </button>

        </div>
    )
}

export default Component