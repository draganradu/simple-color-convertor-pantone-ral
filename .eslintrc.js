module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        semi: ['error', 'never'],
        indent: ['error', 4],
        'max-len': ['error', { code: 120 }],
        'comma-dangle': ['error', 'always-multiline'],
        'no-underscore-dangle': 'off',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-restricted-syntax': ['error', 'BinaryExpression[operator="in"]'],
        'linebreak-style': 0,
        'no-bitwise': ['error', { allow: ['&', '>>', '<<'] }],
    },
}
