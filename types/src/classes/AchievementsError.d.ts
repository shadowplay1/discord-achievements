import { ErrorCodes } from '../structures/ErrorCodes';
/**
 * AchievementsError class.
 * @extends {Error}
 */
export declare class AchievementsError extends Error {
    code?: ErrorCodes;
    constructor(message: string, code?: ErrorCodes);
}
