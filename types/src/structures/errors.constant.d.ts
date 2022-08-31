export declare const errors: {
    invalidErrorCode: string;
    databaseFileMalformed: string;
    noConnectionData: string;
    achievements: {
        notFound(id: number): string;
    };
    /**
     * `${parameter} is required but is missing.`
     * @param {string} parameter
     * @returns {string}
     */
    requiredParameterMissing(parameter: string): string;
    /**
     * `${parameter} must be a ${type}, but received ${receivedType}.`
     * @param {string} parameter
     * @param {string} type
     * @param {string} receivedType
     * @returns {string}
     */
    invalidType(parameter: string, type: string, receivedType: string): string;
    /**
     * `Target for ${method} must be a(n) ${type}, but it is ${receivedType}.`
     * @param {string} method
     * @param {string} type
     * @param {string} receivedType
     * @returns {string}
     */
    invalidTargetType(method: string, type: string, receivedType: string): string;
    /**
     * `Target for ${method} is empty, but it shouldn't.`
     * @param {string} method
     * @returns {string}
     */
    targetIsEmpty(method: string): string;
    /**
     * `The database type is '${databaseType}',
     *  but the options were specified for ${specifiedOptionsType}.`
     * @param {'MongoDB' | 'JSON'} databaseType
     * @param {'MongoDB' | 'JSON'} specifiedOptionsType
     * @returns {string}
     */
    databaseOptionsMismatch(databaseType: 'MongoDB' | 'JSON', specifiedOptionsType: 'MongoDB' | 'JSON'): string;
    /**
     * `Failed to connect to the MongoDB cluster: ${error.message}`
     * @param {Error} error
     * @returns {string}
     */
    connectionError(error: Error): string;
};
