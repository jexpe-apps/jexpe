module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'prettier',
    ],
    root: true,
    rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        'react-hooks/exhaustive-deps': 'off',
    },
}
