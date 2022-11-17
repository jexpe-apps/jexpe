import { Gear, HardDrives, Terminal, UsersThree, Vault } from 'phosphor-react'
import { FC } from 'react'
import { NavItem } from './navitem'

const Component: FC = () => {

    return (
        <div className='h-full border-r border-primary-500 flex flex-col justify-between p-2'>

            <div className='flex flex-col gap-2'>

                <NavItem href='/'>
                    <Vault size={24} weight='duotone' />
                </NavItem>

                <NavItem href='/teams'>
                    <UsersThree size={24} weight='duotone' />
                </NavItem>

                <NavItem href='/sessions'>
                    <Terminal size={24} weight='duotone' />
                </NavItem>

            </div>

            <NavItem href='/workspace/1234'>
                <Gear size={24} weight='duotone' />
            </NavItem>

        </div>
    )
}

export default Component