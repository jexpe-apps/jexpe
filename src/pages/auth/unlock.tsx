import { Button, IconKey, Input } from '@supabase/ui'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { useVault } from 'src/contexts'
import OnePasswordLockSVG from 'src/assets/lock.svg'
import Image from 'next/image'
import { FullScreenLayout } from 'src/layouts'
import { NextPageWithLayout } from 'src/types'

const Unlock: NextPageWithLayout = () => {

    const router = useRouter()
    const { unlock } = useVault()
    const [feedback, setFeedback] = useState('')

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const form = event.currentTarget
        const formElements = form.elements as typeof form.elements & {
            password: HTMLInputElement
        }

        unlock(formElements.password.value)
            .then(() => router.push('/'))
            .catch(() => setFeedback('Invalid password'))
    }

    return (
        <div className='w-full h-full flex flex-col justify-center items-center gap-20'>

            <Image src={OnePasswordLockSVG} height={128} width={128} layout='fixed' priority/>

            <form onSubmit={onSubmit} className='flex flex-col gap-2 w-1/3'>
                {feedback && (<p className='text-brand-red'>{feedback}</p>)}
                <Input
                    icon={<IconKey />}
                    placeholder='Enter your password'
                    type='password'
                    id='password'
                    autoComplete='password'
                    required
                />
                <Button htmlType='submit' className='w-full'>
                    Unlock
                </Button>
            </form>

        </div>
    )

}

Unlock.getLayout = FullScreenLayout
Unlock.authRequired = false
export default Unlock