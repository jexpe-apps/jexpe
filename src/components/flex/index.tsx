import type { FCWithChildren } from 'src/types'
import type { IFlexProps } from './types'
import { theme } from 'antd'

const Component: FCWithChildren<IFlexProps> =
    ({
         children,
         direction,
         grow,
         basis,
         shrink,
         wrap,
         align,
         justify,
         ...props
     }) => {

        return (
            <div {...props} style={{
                display: 'flex',
                flexDirection: direction,
                flexGrow: grow,
                flexBasis: basis,
                flexShrink: shrink,
                flexWrap: wrap,
                alignItems: align,
                justifyContent: justify,
                ...props.style,
            }}>
                {children}
            </div>
        )
    }

export default Component