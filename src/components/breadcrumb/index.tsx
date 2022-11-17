import { House, HouseSimple } from 'phosphor-react'
import { FC, ReactNode } from 'react'

const Component: FC<{
    root: ReactNode,
    routes: {
        name: string,
        href: string,
        current: boolean
    }[]
}> = ({ root, routes }) => {

    return (
        <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center gap-2'>
                <li>
                    <div>
                        {root}
                    </div>
                </li>
                {routes.map((page) => (
                    <li key={page.name}>
                        <div className='flex items-center'>
                            <svg
                                className='h-5 w-5 flex-shrink-0 text-gray-300'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                                aria-hidden='true'
                            >
                                <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                            </svg>
                            <a
                                href={page.href}
                                className='ml-2 text-sm font-medium text-gray-500 hover:text-gray-700'
                                aria-current={page.current ? 'page' : undefined}
                            >
                                {page.name}
                            </a>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )

}

export default Component