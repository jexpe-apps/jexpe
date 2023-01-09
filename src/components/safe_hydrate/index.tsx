import { FCWithChildren } from 'src/types'

const Component: FCWithChildren = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

export default Component