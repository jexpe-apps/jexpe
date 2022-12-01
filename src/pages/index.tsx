import { NextPageWithLayout } from 'src/types'
import { Button, Paper, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { invoke } from '@tauri-apps/api/tauri'
import { showNotification } from '@mantine/notifications'
import { X } from 'phosphor-react'

const Page: NextPageWithLayout = () => {
    const form = useForm({
        initialValues: {
            password: '',
        },
    })

    return (
        <Paper withBorder w="30%" p="xl">
            <form
                onSubmit={form.onSubmit(() => {
                    invoke('open_vault', {
                        masterPassword: form.values.password,
                    })
                        .then((res) =>
                            showNotification({
                                title: 'Success',
                                message: 'Vault opened',
                                icon: <X size={18} />,
                            })
                        )
                        .catch((err) =>
                            showNotification({
                                color: 'red',
                                title: 'Wrong password',
                                message: err,
                                // 'The password you entered is incorrect',
                                icon: <X size={18} />,
                            })
                        )
                })}
            >
                <Stack>
                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) =>
                            form.setFieldValue(
                                'password',
                                event.currentTarget.value
                            )
                        }
                        error={
                            form.errors.password &&
                            'Password should include at least 6 characters'
                        }
                    />
                    <Button type="submit">Unlock vault</Button>
                </Stack>
            </form>
        </Paper>
    )
}

export default Page
