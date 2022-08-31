import { Achievements } from '../Achievements';
import { IAchievementsOptions, ICheckerOptions } from '../types/options.interface';
/**
 * Utils manager class.
 */
export declare class UtilsManager {
    private achievements;
    private _logger;
    options: IAchievementsOptions<any>;
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
