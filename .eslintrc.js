module.exports = {
    root: true,
    extends: ['next/core-web-vitals', 'plugin:jsx-a11y/strict', 'plugin:prettier/recommended'],
    plugins: ['simple-import-sort', 'jsx-a11y'],
    parserOptions: {
        project: './tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: false,
    },
    rules: {
        'sort-imports': 'off',
        'import/order': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Node.js builtins
                    [`^(${require('module').builtinModules.join('|')})(/|$)`],
                    // Packages. `react` related packages come first.
                    ['^react', '^@?\\w'],
                    // Internal packages.
                    [`^@\/[^/]+(\/.*|$)`],
                    // Side effect imports.
                    ['^\\u0000'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // Style imports.
                    ['^.+\\.s?css$'],
                ],
            },
        ],
        'react/jsx-sort-props': [
            'error',
            {
                callbacksLast: true,
                shorthandLast: true,
                reservedFirst: true,
            },
        ],
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
