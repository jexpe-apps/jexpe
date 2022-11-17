import { Sidebar, Tabs } from 'src/components'
import { LayoutFC } from 'src/types'

const Layout: LayoutFC = (page) => {

    return (
        <main className='h-screen w-screen flex flex-col items-center justify-between'>

            <Tabs />

            <div className='h-full w-full overflow-hidden'>
                {page}
            </div>

        </main>
    )

}

export default Layout