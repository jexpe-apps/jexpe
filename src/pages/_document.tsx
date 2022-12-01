import { createGetInitialProps } from '@mantine/next'
import Document from 'next/document'

const getInitialProps = createGetInitialProps()

class _Document extends Document {
    static getInitialProps = getInitialProps
}

export default _Document