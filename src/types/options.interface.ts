import Economy from 'discord-economy-super'
import EconomyMongo from 'discord-economy-super/mongodb'

import Leveling from 'discord-leveling-super'

import { MongoConnectionOptions } from 'quick-mongo-super/typings/interfaces/QuickMongo'
import { If } from './misc/If'


export interface IBaseAchievementsOptions<IsMongoDBUsed extends boolean> {

    /**
     * The region (example: 'ru'; 'en') to format the date and time.
     */
    dateLocale?: Intl.LocalesArgument

    /**
     * Achievement plugins to use.
     */
    plugins?: IAchievementsPlugins<IsMongoDBUsed>

    /**
     * Configuration for the options checker.
     */
    optionsChecker?: ICheckerOptions

    /**
     * Enables or disables debug mode.
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
     * The path to the JSON file.
     * @type {string}
     * @default './achievements.json'
     */
    path?: string

    /**
     * JSON file checking interval (in milliseconds).
     * @type {number}
     * @default 5000
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
