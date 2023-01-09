import { ReactNode } from 'react'

export interface ITabProps {
    href: string
    label: string
    icon?: ReactNode
    onClose?: () => void
    dragging?: boolean
}
