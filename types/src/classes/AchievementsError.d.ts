import { ErrorCodes } from '../structures/ErrorCodes';
/**
 * Achievements error class.
 * @extends {Error}
 */
export declare class AchievementsError extends Error {
    code?: ErrorCodes;
    constructor(message: string, code?: ErrorCodes);
}
