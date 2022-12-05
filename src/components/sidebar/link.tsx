import { createStyles, Tooltip, UnstyledButton } from '@mantine/core'
import { FC } from 'react'
import { HouseSimple } from 'phosphor-react'

const useStyles = createStyles((theme) => ({
    link: {
        width: 48,
        height: 48,
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

export const SidebarLink: FC<{
    icon: typeof HouseSimple;
    label: string;
    active?: boolean;
    onClick?(): void;
}> = ({ icon: Icon, label, active, onClick }) => {
    const { classes, cx } = useStyles()
    return (
        <Tooltip label={label} position='right' transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon weight='duotone' size={24} />
            </UnstyledButton>
        </Tooltip>
    )
}