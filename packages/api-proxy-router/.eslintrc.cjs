module.exports = {
    extends: ['@donmahallem/eslint-config'],
    rules: {
        'jsdoc/check-tag-names': [
            'error' | 'warn',
            {
                definedTags: ['api', 'apiParam', 'apiQuery'],
            },
        ],
    },
    parserOptions: {
        project: './tsconfig.json',
    },
    settings: {
        jsdoc: {
            structuredTags: {
                apiVersion: {
                    required: ['name'],
                },
                api: {
                    type: ['get', 'post', 'put', 'delete', 'head'],
                    required: ['type'],
                },
            },
        },
    },
};
