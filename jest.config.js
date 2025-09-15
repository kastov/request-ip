'use strict';

module.exports = {
    collectCoverage: true,
    testEnvironment: 'node',
    coverageReporters: ['text', 'html'],
    testMatch: ['**/test/**/*.[jt]s?(x)'],
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
