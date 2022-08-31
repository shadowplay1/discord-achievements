export const errors = {
    invalidErrorCode: 'Invalid error code.',
    databaseFileMalformed: 'Database file is malformed.',
    noConnectionData: 'No connection data is provided.',

    achievements: {
        notFound(id: number): string {
            return `Achievement with ID ${id} was not found.`
        }
    },

    /**
     * `${parameter} is required but is missing.`
     * @param {string} parameter
     * @returns {string}
     */
    requiredParameterMissing(parameter: string): string {
        return `${parameter} is required but is missing.`
    },

    /**
     * `${parameter} must be a ${type}, but received ${receivedType}.`
     * @param {string} parameter
     * @param {string} type
     * @param {string} receivedType
     * @returns {string}
     */
    invalidType(parameter: string, type: string, receivedType: string): string {
        return `${parameter} must be ${type == 'array' || type.toLowerCase().startsWith('e') ?
                `an ${type}` :
                `a ${type}`}, but received ${receivedType}.`
    },

    /**
     * `Target for ${method} must be a(n) ${type}, but it is ${receivedType}.`
     * @param {string} method
     * @param {string} type
     * @param {string} receivedType
     * @returns {string}
     */
    invalidTargetType(method: string, type: string, receivedType: string): string {
        return `Target for ${method} must be ${type == 'array' ? `an ${type}` : `a ${type}`}, but it is ${receivedType}.`
    },

    /**
     * `Target for ${method} is empty, but it shouldn't.`
     * @param {string} method
     * @returns {string}
     */
    targetIsEmpty(method: string): string {
        return `Target for ${method} is empty, but it shouldn't.`
    },

    /**
     * `The database type is '${databaseType}',
     *  but the options were specified for ${specifiedOptionsType}.`
     * @param {'MongoDB' | 'JSON'} databaseType
     * @param {'MongoDB' | 'JSON'} specifiedOptionsType
     * @returns {string}
     */
    databaseOptionsMismatch(databaseType: 'MongoDB' | 'JSON', specifiedOptionsType: 'MongoDB' | 'JSON'): string {
        const message =
            `The database type is '${databaseType}', ` +
            `but the options were specified for ${specifiedOptionsType}.`

        return message
    },

    /**
     * `Failed to connect to the MongoDB cluster: ${error.message}`
     * @param {Error} error
     * @returns {string}
     */
    connectionError(error: Error): string {
        return `Failed to connect to the MongoDB cluster: ${error.message}`
    }
}
