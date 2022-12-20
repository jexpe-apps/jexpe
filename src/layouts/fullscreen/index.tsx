import { LayoutFC } from 'src/types'

const Layout: LayoutFC = (page) => {
    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            {page}
        </div>
    )
}

export default Layout
