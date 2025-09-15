'use strict';

import { Request } from './request';

/**
 * Retrieve the client IP address for the given `request`.
 *
 * @param {Object} request
 * @param {String[]} prependCustomHeaders
 *
 * @returns {String}
 */
export function getClientIp(request: any, prependCustomHeaders: string[] = []): string | undefined {
    return new Request(request).getClientIp(prependCustomHeaders);
}
