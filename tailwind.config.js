/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{jsx,tsx}',
    ],
    theme: {
        extend: {
            minWidth: {
                '1/2': '50%',
                '1/4': '25%',
                '3/4': '75%',
            },
            colors: {
                'brand': {
                    'red': '#eb3c30',
                    'orange': '#ff9500',
                    'yellow': '#ffcc00',
                    'green': '#10B981',
                    'mint': '#00c7be',
                    'teal': '#30b0c7',
                    'cyan': '#32ade6',
                    'blue': '#007bff',
                    'indigo': '#5856d6',
                    'purple': '#af52de',
                    'pink': '#ff2d55',
                    'brown': '#a2845e',
                    DEFAULT: '#10B981',
                },
                'primary': {
                    900: '#161616',
                    800: '#1c1c1c',
                    700: '#232323',
                    600: '#282828',
                    500: '#2e2e2e',
                    400: '#343434',
                    300: '#3e3e3e',
                    200: '#505050',
                    100: '#707070',
                    50: '#7e7e7e',
                },
                'secondary': {
                    900: '#181818',
                    800: '#2f2f2f',
                    700: '#474747',
                    600: '#5f5f5f',
                    500: '#777777',
                    400: '#8e8e8e',
                    300: '#a6a6a6',
                    200: '#bebebe',
                    100: '#d5d5d5',
                    50: '#ededed',
                },
            },
            fontSize: {
                xxs: '.6rem',
            },
            borderRadius: {
                DEFAULT: '0.5rem',
            },
        },
    },
    plugins: [],
}
