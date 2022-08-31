import { Achievements } from '../Achievements';
import { IAchievementsOptions, ICheckerOptions } from '../types/options.interface';
/**
 * Utils manager class.
 */
export declare class UtilsManager {
    /**
     * Main Achievements instance.
     * @type {Achievements}
     * @private
     */
    achievements: Achievements<any>;
    /**
     * Module configuration.
     * @type {IAchievementsOptions}
     */
    options: IAchievementsOptions<any>;
    /**
     * Module logger.
     * @type {Logger}
     * @private
     */
    private _logger;
    constructor(achievements: Achievements<any>, options: IAchievementsOptions<any>);
    /**
     * Checks the configuration, shows the problems, fixes them and returns a fixed configuration object.
     * @param {CheckerOptions} options Options checker configuration.
     * @param {IAchievementsOptions} achievementsConfiguration Economy configuration to check.
     * @returns {IAchievementsOptions} Fixed Economy configuration.
     */
    checkOptions(options?: ICheckerOptions, achievementsConfiguration?: IAchievementsOptions<any>): IAchievementsOptions<any>;
    /**
     * Checks the database for errors.
     * @param {string} databaseContents Database file contents.
     * @returns {void}
     */
    checkDatabase: (databaseContents: string) => void;
}
