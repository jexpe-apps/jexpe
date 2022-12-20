import { NextPageWithLayout } from 'src/types'
import { FullScreenLayout } from 'src/layouts'
import { useLocalVault } from 'src/contexts'
import { useRouter } from 'next/router'

const Page: NextPageWithLayout = () => {

    const router = useRouter()
    const { tryMasterPassword } = useLocalVault()

    return (
        <div>
            <button onClick={() => {
                tryMasterPassword('mela')
                    .then(() => {
                        router.push('/vault')
                    })
            }}>
                Unlock
            </button>
        </div>
    )

}

Page.protectedRoute = false
Page.getLayout = FullScreenLayout

export default Page