import { FCWithChildren } from 'src/types'

const Component: FCWithChildren = ({ children }) => (
    <div className="flex justify-center items-center">{children}</div>
)

export default Component
