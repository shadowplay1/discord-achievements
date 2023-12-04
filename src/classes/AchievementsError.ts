import { errors } from '../structures/errors.constant'
import { ErrorCodes } from '../structures/ErrorCodes'


/**
 * Achievements error class.
 * @extends {Error}
 */
export class AchievementsError extends Error {
    public code?: ErrorCodes

    constructor(message: string, code?: ErrorCodes) {
        super(message || 'Unknown Error')

        if (!message) {
            code = ErrorCodes.INVALID_ERROR_CODE
        }

        if (code && !ErrorCodes[code]) {
            throw new AchievementsError(errors.invalidErrorCode, ErrorCodes.INVALID_ERROR_CODE)
        }

        /**
         * Error name.
         * @type {string}
         */
        this.name = `AchievementsError [${code}]`

        /**
         * Error code.
         * @type {ErrorCodes}
         */
        this.code = code

        /**
         * Error stack.
         * @type {?string}
         */
        this.stack
    }
}
