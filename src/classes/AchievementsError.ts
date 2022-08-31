import { errors } from '../structures/errors.constant'
import { ErrorCodes } from '../structures/ErrorCodes'


/**
 * AchievementsError class.
 * @extends {Error}
 */
export class AchievementsError extends Error {
    public code?: ErrorCodes

    constructor(message: string, code?: ErrorCodes) {
        super(message || 'Unknown Error')
        Error.captureStackTrace(this, this.constructor)

        if (!message) {
            code = ErrorCodes.INVALID_ERROR_CODE
        }

        if (code && !ErrorCodes[code]) {
            throw new AchievementsError(errors.invalidErrorCode, ErrorCodes.INVALID_ERROR_CODE)
        }

        this.name = `AchievementsError [${code}]`
        this.code = code
    }
}
