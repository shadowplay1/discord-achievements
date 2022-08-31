/**
 * Checks for is the item object and returns it.
 * @param {any} item The item to check.
 * @returns {boolean} Whether the specified item is object.
*/
export function isObject(item: any): boolean {
    return !Array.isArray(item)
        && typeof item == 'object'
        && item !== null
}

/**
 * @callback isObject Checks for is the item object and returns it.
 * @param {any} item The item to check.
 * @returns {boolean} Whether the specified item is object.
 */
