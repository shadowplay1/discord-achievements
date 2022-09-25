import Economy from 'discord-economy-super'
import EconomyMongo from 'discord-economy-super/mongodb'

import Leveling from 'discord-leveling-super'

import { MongoConnectionOptions } from 'quick-mongo-super/typings/interfaces/QuickMongo'
import { If } from './misc/If.type'


export interface IBaseAchievementsOptions<IsMongoDBUsed extends boolean> {

    /**
     * The region (example: 'ru', 'en') to format the date and time.
     */
    dateLocale?: Intl.LocalesArgument

    /**
     * Achievements plugins to use.
     */
    plugins?: IAchievementsPlugins<IsMongoDBUsed>

    /**
     * Configuration for the options checker.
     */
    optionsChecker?: ICheckerOptions

    /**
     * If true, debug mode will be enabled.
     */
    debug?: boolean
}

export type IAchievementsOptions<IsMongoDBUsed extends boolean> = If<
    IsMongoDBUsed,
    IBaseAchievementsOptions<IsMongoDBUsed> & {

        /**
        * The database to use (MongoDB or JSON are available). Default: JSON
        */
        databaseType: DatabaseType.MONGODB

        /**
         * MongoDB connection options. Required if databaseType is MongoDB.
         */
        mongo: MongoConnectionOptions
    },

    IBaseAchievementsOptions<IsMongoDBUsed> & {

        /**
         * The database to use (MongoDB or JSON are available). Default: JSON
         */
        databaseType: DatabaseType.JSON

        /**
         * JSON database options. Required if databaseType is JSON.
         */
        json?: IJSONDatabaseOptions
    }
>

export enum DatabaseType {
    MONGODB = 'MongoDB',
    JSON = 'JSON'
}

export interface IJSONDatabaseOptions {

    /**
     * The path to a JSON file.
     */
    path?: string

    /**
     * JSON file checking interval (in milliseconds).
     */
    checkingInterval?: number
}

export interface ICheckerOptions {

    /**
     * Allows the method to ignore the options with invalid types. Default: false.
     */
    ignoreInvalidTypes?: boolean

    /**
     * Allows the method to ignore the unspecified options. Default: true.
     */
    ignoreUnspecifiedOptions?: boolean

    /**
     * Allows the method to ignore the unexisting options. Default: false.
     */
    ignoreInvalidOptions?: boolean

    /**
     * Allows the method to show all the problems in the console. Default: true.
     */
    showProblems?: boolean

    /**
     * Allows the method to send the result in the console.
     * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
     */
    sendLog?: boolean

    /**
     * Allows the method to send the result if no problems were found. Default: false
     */
    sendSuccessLog?: boolean
}


export interface IAchievementsPlugins<IsMongoDBUsed extends boolean> {
    economy?: If<IsMongoDBUsed, EconomyMongo, Economy>
    leveling?: Leveling
}


/**
 * @typedef {object} IAchievementsPlugins Achievements plugins object.
 *
 * Type parameters:
 *
 * - IsMongoDBUsed (boolean): A boolean value that indicates whether the MongoDB database is used.
 *
 * @prop {If<IsMongoDBUsed, EconomyMongo, Economy>} [economy] Economy plugin.
 * @prop {Leveling} [leveling] Leveling plugin.
 */

/**
 * @typedef {object} CheckerOptions Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {boolean} [ignoreUnspecifiedOptions=true] Allows the method to ignore the unspecified options. Default: false.
 * @property {boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {boolean} [showProblems=true] Allows the method to show all the problems in the console. Default: false.
 *
 * @property {boolean} [sendLog=true] Allows the method to send the result in the console.
 * Requires the 'showProblems' or 'sendLog' options to set. Default: false.
 *
 * @property {boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * @typedef {object} IJSONDatabaseOptions JSON database configuration.
 * @prop {string} [path='./achievements.json'] The path to a JSON file.
 * @prop {number} [checkingInterval=5000] JSON file checking interval (in milliseconds).
 */

/**
 * @typedef {object} DatabaseType Database types.
 * @prop {string} MONGODB 'MongoDB' database type.
 * @prop {string} JSON 'JSON' database type.
 */

/**
 * @typedef {object} IBaseAchievementsOptions Base achievements configuration object.
 *
 * Type parameters:
 *
 * - IsMongoDBUsed (boolean): A boolean value that indicates whether the MongoDB database is used.
 *
 * @prop {Intl.LocalesArgument} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time.
 * @prop {IAchievementsPlugins<IsMongoDBUsed>} [plugins] Achievements plugins to use.
 * @prop {ICheckerOptions} [optionsChecker=ICheckerOptions] Configuration for the options checker.
 * @prop {boolean} [debug=false] If true, debug mode will be enabled.
 */

/**
 * @typedef {object} IAchievementsOptions Achievements configuration object.
 *
 * Type parameters:
 *
 * - IsMongoDBUsed (boolean): A boolean value that indicates whether the MongoDB database is used.
 *
 * @prop {Intl.LocalesArgument} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time.
 * @prop {IAchievementsPlugins<IsMongoDBUsed>} [plugins] Achievements plugins to use.
 * @prop {ICheckerOptions} [optionsChecker=ICheckerOptions] Configuration for the options checker.
 * @prop {boolean} [debug=false] If true, debug mode will be enabled.
 * @prop {DatabaseType} databaseType The database to use.
 *
 * @prop {IJSONDatabaseOptions} [json] JSON database configuration. Required if database type is JSON.
 * @prop {MongoConnectionOptions} [mongo] MongoDB connection data. Required if database type is MongoDB.
 */
