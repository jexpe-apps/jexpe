import { NextPageWithLayout } from 'src/types'
import { FullScreenLayout } from 'src/layouts'
import { invoke } from '@tauri-apps/api/tauri'
import { showNotification } from '@mantine/notifications'
import { X } from 'phosphor-react'
import { Button, Paper, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { useVault } from 'src/contexts'

const Page: NextPageWithLayout = () => {

    const router = useRouter()
    const { unlockVault } = useVault()

    const form = useForm({
        initialValues: {
            password: '',
        },
    })

    return (
        <Paper withBorder w='30%' p='xl'>
            <form onSubmit={form.onSubmit(() => unlockVault(form.values.password))}>
                <Stack>
                    <PasswordInput
                        required
                        label='Password'
                        placeholder='Your password'
                        value={form.values.password}
                        onChange={(event) =>
                            form.setFieldValue(
                                'password',
                                event.currentTarget.value,
                            )
                        }
                        error={
                            form.errors.password &&
                            'Password should include at least 6 characters'
                        }
                    />
                    <Button type='submit'>Unlock vault</Button>
                </Stack>
            </form>
        </Paper>
    )

}

Page.requireVaultUnlocked = false
Page.getLayout = FullScreenLayout

export default Page