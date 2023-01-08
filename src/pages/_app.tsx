import 'src/xterm.css'
import 'src/globals.css'

import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? DefaultLayout

    return <>{getLayout(<Component {...pageProps} />)}</>
}

export default MyApp
