import { FC } from 'react'
import { HouseSimple } from 'phosphor-react'

export const SidebarLink: FC<{
    icon: typeof HouseSimple;
    label: string;
    active?: boolean;
    onClick?(): void;
}> = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button onClick={onClick}>
            <Icon weight='duotone' size={24} />
        </button>
    )
}