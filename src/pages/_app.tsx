import 'src/globals.css'
import 'src/xterm.css'

import { VaultGuard } from 'src/guards'
import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {

    const getLayout = Component.getLayout ?? DefaultLayout
    const authRequired = Component.authRequired ?? true

    return (
        <VaultGuard authRequired={authRequired}>
            {getLayout(<Component {...pageProps} />)}
        </VaultGuard>
    )
}

export default MyApp