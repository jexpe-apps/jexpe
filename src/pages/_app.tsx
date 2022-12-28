import 'src/xterm.css'
import 'src/globals.css'

import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'
import { LocalVaultGuard } from 'src/guards'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? DefaultLayout
    const protectedRoute = Component.protectedRoute ?? true

    return (
        <LocalVaultGuard protectedRoute={protectedRoute}>
            {getLayout(<Component {...pageProps} />)}
        </LocalVaultGuard>
    )
}

export default MyApp
