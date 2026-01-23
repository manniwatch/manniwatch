import donmahallemConfig from '@donmahallem/eslint-config';
import tseslint from 'typescript-eslint';

export default [
    // 1. Include the base config
    ...donmahallemConfig,

    // 2. Project-specific overrides and parser options
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                // It's often safer to use import.meta.dirname to ensure
                // the path is relative to the config file
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Your custom rules go here
        },
    },
];
