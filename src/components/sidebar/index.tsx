import { useState } from 'react'
import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack } from '@mantine/core'
import { Fingerprint, Gear, House, HouseSimple, SignOut, Swap, Vault } from 'phosphor-react'

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}))

interface NavbarLinkProps {
    icon: typeof HouseSimple;
    label: string;
    active?: boolean;

    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles()
    return (
        <Tooltip label={label} position='right' transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon weight='duotone' size={32} />
            </UnstyledButton>
        </Tooltip>
    )
}

const mockdata = [
    { icon: House, label: 'Home' },
    { icon: Vault, label: 'Vault' },
    { icon: Fingerprint, label: 'Keys' },
    { icon: Gear, label: 'Settings' },
]

export default function NavbarMinimal() {
    const [active, setActive] = useState(2)

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ))

    return (
        <Navbar width={{ base: 80 }} p='md'>
            {/*<Center>*/}
            {/*    <MantineLogo type='mark' size={30} />*/}
            {/*</Center>*/}
            <Navbar.Section grow mt={50}>
                <Stack justify='center' spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify='center' spacing={0}>
                    <NavbarLink icon={Swap} label='Change account' />
                    <NavbarLink icon={SignOut} label='Logout' />
                </Stack>
            </Navbar.Section>
        </Navbar>
    )
}