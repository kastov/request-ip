import { getClientIp } from '../src/index';

describe('Request IP: ', () => {
    it('exports a function', () => {
        expect(getClientIp).toBeInstanceOf(Function);
    });

    it('request headers is undefined', () => {
        expect(getClientIp(undefined)).toBeUndefined();
        expect(getClientIp(null)).toBeUndefined();

        expect(getClientIp({})).toBeUndefined();
        expect(getClientIp(123 as any)).toBeUndefined();
        expect(getClientIp('request' as any)).toBeUndefined();
    });

    it('handles null values', () => {
        expect(getClientIp({ info: { remoteAddress: undefined } })).toBeUndefined();

        expect(getClientIp({ info: { remoteAddress: null } })).toBeUndefined();

        expect(getClientIp({ headers: { remoteAddress: null } })).toBeUndefined();
    });

    it('x-client-ip', () => {
        expect(getClientIp({ headers: { 'x-client-ip': '8.8.8.8' } })).toEqual('8.8.8.8');

        expect(getClientIp({ headers: { 'x-client-ip': 'not-an-ip' } })).toBeUndefined();
    });

    it('fastly-client-ip', () => {
        expect(getClientIp({ headers: { 'fastly-client-ip': '8.8.8.8' } })).toEqual('8.8.8.8');
    });

    it('cf-connecting-ip', () => {
        expect(getClientIp({ headers: { 'cf-connecting-ip': '8.8.8.8' } })).toEqual('8.8.8.8');
    });

    it('true-client-ip', () => {
        expect(getClientIp({ headers: { 'true-client-ip': '8.8.8.8' } })).toEqual('8.8.8.8');
    });

    it('x-real-ip', () => {
        expect(getClientIp({ headers: { 'x-real-ip': '8.8.8.8' } })).toEqual('8.8.8.8');
    });

    it('x-cluster-client-ip', () => {
        expect(getClientIp({ headers: { 'x-cluster-client-ip': '8.8.8.8' } })).toEqual('8.8.8.8');
    });

    it('x-forwarded-for', () => {
        expect(getClientIp({ headers: { 'x-forwarded-for': null } })).toBeUndefined();
        expect(getClientIp({ headers: { 'x-forwarded-for': undefined } })).toBeUndefined();

        expect(getClientIp({ headers: { 'x-forwarded-for': '8.8.8.8' } })).toEqual('8.8.8.8');

        expect(getClientIp({ headers: { 'x-forwarded-for': '8.8.8.8, 4.4.4.4' } })).toEqual(
            '8.8.8.8',
        );

        expect(
            getClientIp({ headers: { 'x-forwarded-for': '8.8.8.8, 4.4.4.4, 1.1.1.1' } }),
        ).toEqual('8.8.8.8');
    });

    it('x-forwarded-for with masked (unknown) IPs', () => {
        expect(
            getClientIp({
                headers: { 'x-forwarded-for': 'unknown, [redacted], 8.8.8.8, 4.4.4.4' },
            }),
        ).toEqual('8.8.8.8');
    });

    it('x-forwarded-for with port', () => {
        expect(
            getClientIp({
                headers: { 'x-forwarded-for': 'unknown, 8.8.8.8:443, 4.4.4.4:443' },
            }),
        ).toEqual('8.8.8.8');
    });

    it('forwarded-for', () => {
        expect(getClientIp({ headers: { 'forwarded-for': '8.8.8.8' } })).toEqual('8.8.8.8');

        expect(getClientIp({ headers: { 'forwarded-for': '8.8.8.8, 4.4.4.4' } })).toEqual(
            '8.8.8.8',
        );

        expect(
            getClientIp({
                headers: { 'forwarded-for': 'unknown, unknown, 8.8.8.8, 4.4.4.4' },
            }),
        ).toEqual('8.8.8.8');
    });

    it('x-forwarded', () => {
        expect(getClientIp({ headers: { 'x-forwarded': '8.8.8.8' } })).toEqual('8.8.8.8');

        expect(getClientIp({ headers: { 'x-forwarded': '8.8.8.8, 4.4.4.4' } })).toEqual('8.8.8.8');

        expect(
            getClientIp({
                headers: { 'x-forwarded': 'unknown, unknown, 8.8.8.8, 4.4.4.4' },
            }),
        ).toEqual('8.8.8.8');
    });

    it('forwarded', () => {
        expect(getClientIp({ headers: { forwarded: '8.8.8.8' } })).toEqual('8.8.8.8');

        expect(getClientIp({ headers: { forwarded: '8.8.8.8, 4.4.4.4' } })).toEqual('8.8.8.8');

        expect(
            getClientIp({ headers: { forwarded: 'unknown, unknown, 8.8.8.8, 4.4.4.4' } }),
        ).toEqual('8.8.8.8');
    });

    it('request.connection', () => {
        expect(getClientIp({ connection: { remoteAddress: '8.8.8.8' } })).toEqual('8.8.8.8');
        expect(getClientIp({ connection: {} })).toBeUndefined();

        expect(getClientIp({ connection: { remoteAddress: 'not-an-ip-address' } })).toBeUndefined();
    });

    it('request.connection.socket', () => {
        expect(getClientIp({ connection: { socket: { remoteAddress: '8.8.8.8' } } })).toEqual(
            '8.8.8.8',
        );
        expect(getClientIp({ connection: { socket: {} } })).toBeUndefined();
        expect(
            getClientIp({ connection: { socket: { remoteAddress: 'invalid-ip' } } }),
        ).toBeUndefined();
    });

    it('request.socket', () => {
        expect(getClientIp({ socket: { remoteAddress: '8.8.8.8' } })).toEqual('8.8.8.8');
        expect(getClientIp({ socket: { remoteAddress: 'invalid-ip' } })).toBeUndefined();

        expect(getClientIp({ socket: {} })).toBeUndefined();
    });

    it('request.info', () => {
        expect(getClientIp({ info: { remoteAddress: '8.8.8.8' } })).toEqual('8.8.8.8');
        expect(getClientIp({ info: { remoteAddress: 'invalid-ip' } })).toBeUndefined();

        expect(getClientIp({ info: {} })).toBeUndefined();
    });

    it('request.requestContext', () => {
        expect(getClientIp({ requestContext: { identity: { sourceIp: '8.8.8.8' } } })).toEqual(
            '8.8.8.8',
        );

        expect(
            getClientIp({ requestContext: { identity: { sourceIp: 'invalid-ip' } } }),
        ).toBeUndefined();

        expect(getClientIp({ requestContext: {} })).toBeUndefined();

        expect(getClientIp({ requestContext: { identity: {} } })).toBeUndefined();
    });

    it('request.raw', () => {
        expect(getClientIp({ raw: { info: { remoteAddress: '8.8.8.8' } } })).toEqual('8.8.8.8');

        expect(getClientIp({ raw: { info: { remoteAddress: 'invalid-ip' } } })).toBeUndefined();

        expect(getClientIp({ raw: { info: {} } })).toBeUndefined();

        expect(getClientIp({ raw: {} })).toBeUndefined();
    });

    it('supports IPv6 addresses', () => {
        expect(
            getClientIp({
                connection: { remoteAddress: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
            }),
        ).toEqual('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

        expect(
            getClientIp({
                headers: { 'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
            }),
        ).toEqual('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    });

    it('supports shortened IPv6 addresses', () => {
        expect(getClientIp({ connection: { remoteAddress: '2001:db8::2:1' } })).toEqual(
            '2001:db8::2:1',
        );
    });

    // New tests for prependCustomHeaders functionality
    describe('prependCustomHeaders', () => {
        it('should return undefined when prependCustomHeaders is empty', () => {
            const request = {
                headers: {
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, [])).toEqual('8.8.8.8');
        });

        it('should prioritize custom headers over default headers', () => {
            const request = {
                headers: {
                    'custom-ip-header': '1.1.1.1',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-ip-header'])).toEqual('1.1.1.1');
        });

        it('should work with multiple custom headers in priority order', () => {
            const request = {
                headers: {
                    'first-custom-header': '1.1.1.1',
                    'second-custom-header': '2.2.2.2',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['first-custom-header', 'second-custom-header'])).toEqual(
                '1.1.1.1',
            );
        });

        it('should fall back to second custom header if first is invalid', () => {
            const request = {
                headers: {
                    'first-custom-header': 'invalid-ip',
                    'second-custom-header': '2.2.2.2',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['first-custom-header', 'second-custom-header'])).toEqual(
                '2.2.2.2',
            );
        });

        it('should fall back to default headers if all custom headers are invalid', () => {
            const request = {
                headers: {
                    'first-custom-header': 'invalid-ip',
                    'second-custom-header': 'also-invalid',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['first-custom-header', 'second-custom-header'])).toEqual(
                '8.8.8.8',
            );
        });

        it('should handle custom headers with comma-separated values', () => {
            const request = {
                headers: {
                    'custom-forwarded': '1.1.1.1, 2.2.2.2, 3.3.3.3',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-forwarded'])).toEqual('1.1.1.1');
        });

        it('should handle custom headers with ports', () => {
            const request = {
                headers: {
                    'custom-ip-with-port': '1.1.1.1:8080',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-ip-with-port'])).toEqual('1.1.1.1');
        });

        it('should handle custom headers with mixed valid and invalid IPs', () => {
            const request = {
                headers: {
                    'custom-mixed': 'unknown, invalid, 1.1.1.1, 2.2.2.2',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-mixed'])).toEqual('1.1.1.1');
        });

        it('should handle case-insensitive custom headers', () => {
            const request = {
                headers: {
                    'Custom-IP-Header': '1.1.1.1',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-ip-header'])).toEqual('1.1.1.1');
        });

        it('should return undefined when custom header exists but contains no valid IP', () => {
            const request = {
                headers: {
                    'custom-invalid': 'not-an-ip',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-invalid'])).toEqual('8.8.8.8');
        });

        it('should work with IPv6 addresses in custom headers', () => {
            const request = {
                headers: {
                    'custom-ipv6': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-ipv6'])).toEqual(
                '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
            );
        });

        it('should handle null and undefined custom header values', () => {
            const request = {
                headers: {
                    'custom-null': null,
                    'custom-undefined': undefined,
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-null', 'custom-undefined'])).toEqual('8.8.8.8');
        });

        it('should handle non-existent custom headers', () => {
            const request = {
                headers: {
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['non-existent-header'])).toEqual('8.8.8.8');
        });

        it('should work when no headers exist at all', () => {
            const request = {
                connection: { remoteAddress: '8.8.8.8' },
            };
            expect(getClientIp(request, ['custom-header'])).toEqual('8.8.8.8');
        });

        it('should handle empty string custom headers', () => {
            const request = {
                headers: {
                    'custom-empty': '',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-empty'])).toEqual('8.8.8.8');
        });

        it('should prioritize first valid custom header over later ones', () => {
            const request = {
                headers: {
                    'first-header': 'invalid-ip',
                    'second-header': '1.1.1.1',
                    'third-header': '2.2.2.2',
                },
            };
            expect(getClientIp(request, ['first-header', 'second-header', 'third-header'])).toEqual(
                '1.1.1.1',
            );
        });

        it('should handle whitespace in custom header values', () => {
            const request = {
                headers: {
                    'custom-whitespace': '  1.1.1.1  ',
                    'x-real-ip': '8.8.8.8',
                },
            };
            expect(getClientIp(request, ['custom-whitespace'])).toEqual('1.1.1.1');
        });
    });
});
