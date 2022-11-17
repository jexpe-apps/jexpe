import { LayoutFC } from 'src/types'

const Layout: LayoutFC = (page) => {

    return (
        <main className='h-screen w-screen flex items-center justify-center'>
            {page}
        </main>
    )

}

export default Layout