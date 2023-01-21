import { ReactNode } from 'react'

export interface ITabProps {
    href: string
    label: string
    icon?: ReactNode
    onClick?: () => void
    onClose?: () => void
    active?: boolean
    dragging?: boolean
}
