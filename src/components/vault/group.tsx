import { FC } from 'react'
import { IVaultGroup } from 'src/types'
import { Stack } from 'phosphor-react'

const Component: FC<{
    group: IVaultGroup
    onClick?: () => void
}> = ({ group, onClick }) => {

    return (
        <button key={group.id} onClick={onClick} className='rounded border border-dark-500 p-2 flex items-center gap-2'>
            <Stack weight='duotone' className='text-brand-700' size={32} />
            <div className='flex flex-col items-start'>
                <p className='font-medium'>{group.display_name}</p>
                <p className='font-thin text-xs'>some description....</p>
            </div>
        </button>
    )

}

export default Component