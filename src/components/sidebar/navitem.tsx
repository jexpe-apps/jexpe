import Link from 'next/link'
import { useRouter } from 'next/router'
import { FCWithChildren } from 'src/types'

export const NavItem: FCWithChildren<{
    href: string
}> = ({ children, href }) => {

    const { pathname } = useRouter()

    return (
        <Link href={href}>
            <div className={`${pathname === href ? 'text-brand' : ''} cursor-pointer rounded w-10 h-10 hover:bg-primary-700 flex items-center justify-center`}>
                {children}
            </div>
        </Link>
    )
}