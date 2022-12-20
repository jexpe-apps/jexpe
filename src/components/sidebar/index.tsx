import { Fingerprint, Gear, Vault } from 'phosphor-react'
import { SidebarLink } from './link'
import { useRouter } from 'next/router'

const SIDEBAR_LINKS = [
    { icon: Vault, label: 'Vault', href: '/' },
    { icon: Fingerprint, label: 'SSH Keys', href: '/ssh_keys' },
]

export default function NavbarMinimal() {

    const router = useRouter()

    const links = SIDEBAR_LINKS.map((link) => (
        <SidebarLink
            {...link}
            key={link.label}
            active={router.pathname === link.href}
            onClick={() => router.push(link.href)}
        />
    ))

    return (
        <div className='h-full flex flex-col justify-between p-2'>
            <div className='h-full flex flex-col gap-2'>
                {links}
            </div>
            <SidebarLink
                icon={Gear}
                label='Preferences'
                key='Preferences'
                active={router.pathname === '/preferences'}
                onClick={() => router.push('/preferences')}
            />
        </div>
    )
}