import 'src/xterm.css'
import 'src/globals.css'

import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'
import { LocalVaultGuard } from 'src/guards'
import { useTabManager } from 'src/contexts'


const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {

    const { ptys } = useTabManager()

    const getLayout = Component.getLayout ?? DefaultLayout
    const protectedRoute = Component.protectedRoute ?? true

    return (
        <LocalVaultGuard protectedRoute={protectedRoute}>
            {getLayout(<Component {...pageProps} />)}
        </LocalVaultGuard>
    )
}

export default MyApp
