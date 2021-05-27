module.exports = {
    env: {
        browser: true,
        es2020: true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        project: "./tsconfig.json"
    },
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        "plugin:jest/recommended"
    ],
    plugins: [
        '@typescript-eslint',
        'prettier',
        'import',
        'jest'
    ],
    rules: {
    }
};