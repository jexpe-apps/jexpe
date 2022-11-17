import { invoke } from '@tauri-apps/api'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { DynamicTerminal, Vault } from 'src/components'
import { useVault } from 'src/contexts'
import { NextPageWithLayout } from 'src/types'

// const Home: NextPageWithLayout = () => {
//
//     const { vaults } = useVault()
//
//     return (
//         <div className='h-full w-full flex flex-col p-10 gap-5'>
//
//             <div className='flex flex-col gap-2'>
//                 <h1 className='font-semibold text-2xl'>Vaults</h1>
//                 <hr className='border-primary-500' />
//             </div>
//
//             <div className='grid grid-cols-3 gap-5'>
//                 {vaults?.map((vault, index) => (
//                     <Vault key={index} vault={vault} />
//                 ))}
//             </div>
//
//         </div>
//     )
// }
//
// export default Home


const Page: NextPageWithLayout = () => {

    return (
        <div className='h-full w-full p-2'>
            <DynamicTerminal />
        </div>
    )
}

export default Page