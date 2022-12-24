import 'src/xterm.css'
import 'src/globals.css'

import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'
import { LocalVaultGuard } from 'src/guards'
import { SafeHydrate } from 'src/components'


const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {

    const getLayout = Component.getLayout ?? DefaultLayout
    const protectedRoute = Component.protectedRoute ?? true

    return (
        <SafeHydrate>
            <LocalVaultGuard protectedRoute={protectedRoute}>
                {getLayout(<Component {...pageProps} />)}
            </LocalVaultGuard>
        </SafeHydrate>
    )
}

export default MyApp
