module.exports = {
    testMatch: [
        '**/?(*.)spec.ts?(x)'
    ],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
            diagnostics: false,
        },
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
    ],
    testEnvironment: 'jsdom',
    preset: 'ts-jest'
}