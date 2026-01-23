// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const donmahallemConfig = require('@donmahallem/eslint-config');

module.exports = defineConfig([
    {
        files: ['**/*.ts'],
        extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
            '@angular-eslint/prefer-inject': 'warn', // TODO: REMOVE
            '@angular-eslint/prefer-standalone': 'warn', // TODO: REMOVE
            '@typescript-eslint/no-unused-vars': 'warn', // TODO: REMOVE
        },
    },
    {
        files: ['**/*.spec.ts'],
        rules: {
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/directive-selector': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
        rules: {},
    },
]);
