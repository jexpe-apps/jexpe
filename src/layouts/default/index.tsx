import { LayoutFC } from 'src/types'
import { AppShell } from '@mantine/core'
import { Sidebar } from 'src/components'

const Layout: LayoutFC = (page) => {

    return (
        <AppShell
            navbar={<Sidebar />}>
            {page}
        </AppShell>
    )

}

export default Layout