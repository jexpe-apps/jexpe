// import 'src/globals.css'
import 'src/xterm.css'

import { VaultGuard } from 'src/guards'
import { DefaultLayout, FullScreenLayout } from 'src/layouts'
import { AppPropsWithLayout } from 'src/types'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? FullScreenLayout
    const authRequired = Component.authRequired ?? true

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
                primaryColor: 'brand',
                fontFamily: 'Poppins, sans-serif',
                colors: {
                    // override dark colors to change them for all components
                    dark: [
                        '#c1c2c5',
                        '#909296',
                        '#5c5f66',
                        '#484848',
                        '#343434',
                        '#2e2e2e',
                        '#282828',
                        '#232323',
                        '#1c1c1c',
                        '#161616',
                    ],
                    brand: [
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                        '#10B981',
                    ],
                },
            }}
        >
            <NotificationsProvider>
                <VaultGuard authRequired={authRequired}>
                    {getLayout(<Component {...pageProps} />)}
                </VaultGuard>
            </NotificationsProvider>
        </MantineProvider>
    )
}

export default MyApp
