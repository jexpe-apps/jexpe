import 'src/xterm.css'
import 'src/globals.css'

import { DefaultLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'
import { ConfigProvider, theme } from 'antd'
import { PtyContextProvider, TerminalContextProvider } from 'src/contexts'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? DefaultLayout

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#4cc38a',
                    colorSuccess: '#37b24d',
                    colorWarning: '#f59f00',
                    colorError: '#f03e3e',
                    colorInfo: '#1c7ed6',
                    fontSize: 14,
                    wireframe: true,
                    colorBgBase: '#1a1b1e',
                },
            }}
        >
            <PtyContextProvider>
                <TerminalContextProvider>
                    {getLayout(<Component {...pageProps} />)}
                </TerminalContextProvider>
            </PtyContextProvider>
        </ConfigProvider>
    )
}

export default MyApp
