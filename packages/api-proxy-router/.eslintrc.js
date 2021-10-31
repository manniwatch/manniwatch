module.exports = {
    "extends": [
        "@donmahallem/eslint-config"
    ],
    "rules": {
        "jsdoc/check-tag-names": [
            "error" | "warn",
            {
                "definedTags": [
                    "api",
                    "apiParam",
                    "apiQuery"
                ]
            }
        ]
    },
    "parserOptions": {
        "project": "./tsconfig.spec.json",
    },
    "settings": {
        "jsdoc": {
            "structuredTags": {
                "apiName": {
                    "required": ["name"]
                },
                "apiGroup": {
                    "required": ["name"]
                },
                "apiParam": {
                    "required": ["name"]
                },
                "apiVersion": {
                    "required": ["name"]
                },
                // "apiQuery": { "required": false },
                "api": {
                    "type": [
                        "get",
                        "post",
                        "put",
                        "delete",
                        "head"
                    ],
                    "required": [
                        "type"
                    ]
                }
            }
        }
    }
};
