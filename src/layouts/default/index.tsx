import { LayoutFC } from 'src/types'
import { TabManager } from 'src/components'

const Layout: LayoutFC = (page) => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <TabManager />
            {page}
        </div>
    )
}

export default Layout
