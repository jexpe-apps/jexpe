import { FC } from 'react'
import { IVaultHost } from 'src/types'
import { HardDrive } from 'phosphor-react'

const Component: FC<{
    host: IVaultHost
    onClick?: () => void
}> = ({ host, onClick }) => {

    return (
        <button key={host.id} onClick={onClick} className='rounded border border-dark-500 p-2 flex items-center gap-2'>
            <HardDrive weight='duotone' className='text-brand-700' size={32} />
            <div className='flex flex-col items-start'>
                <p className='font-medium'>{host.display_name}</p>
                <p className='font-thin text-xs'>some description....</p>
            </div>
        </button>
    )

}

export default Component