/**
 * Checks for is the item object and returns it.
 * @param {any} item The item to check.
 * @returns {boolean} Is the item object or not.
*/
export function isObject(item: any): boolean {
    return !Array.isArray(item)
        && typeof item == 'object'
        && item !== null
}
