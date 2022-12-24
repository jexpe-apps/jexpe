import { FCWithChildren } from 'src/types'

const Component: FCWithChildren = ({ children }) => {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

export default Component