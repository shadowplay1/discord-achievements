import { existsSync } from 'fs'
import { dirname } from 'path'

import { Achievements } from '../Achievements'
import { DatabaseType, IAchievementsOptions, ICheckerOptions } from '../types/options.interface'

import { defaultModuleConfig } from '../structures/defaultModuleConfig.constant'
import { errors } from '../structures/errors.constant'

import { ErrorCodes } from '../structures/ErrorCodes'

import { Logger } from '../classes/util/Logger'
import { AchievementsError } from '../classes/AchievementsError'


/**
 * Utils manager class.
 */
export class UtilsManager {

    /**
     * Main Achievements instance.
     * @type {Achievements}
     * @private
     */
    public achievements: Achievements<any>

    /**
     * Module configuration.
     * @type {IAchievementsOptions}
     */
    public options: IAchievementsOptions<any>

    /**
     * Module logger.
     * @type {Logger}
     * @private
     */
    private _logger: Logger

    constructor(achievements: Achievements<any>, options: IAchievementsOptions<any>) {
        this.achievements = achievements
        this.options = options || {}

        this._logger = new Logger({
            debug: options.debug,
        })
    }

    /**
     * Checks the configuration, shows the problems, fixes them and returns a fixed configuration object.
     * @param {CheckerOptions} options Options checker configuration.
     * @param {IAchievementsOptions} achievementsConfiguration Economy configuration to check.
     * @returns {IAchievementsOptions} Fixed Economy configuration.
     */
    public checkOptions(
        options: ICheckerOptions = {},
        achievementsConfiguration: IAchievementsOptions<any> = {} as any
    ): IAchievementsOptions<any> {
        this._logger.debug('Debug mode is enabled.', 'lightcyan')
        this._logger.debug('Checking the configuration...')

        const filePathArray = require.main?.filename?.replaceAll('\\', '/')?.split('/') as string[]
        const fileName = filePathArray[filePathArray.length - 1]

        const isTSFileAllowed = fileName.endsWith('.ts')
        const dirName = dirname(require.main?.filename as string).replace('/' + fileName, '').replace('\\' + fileName, '')

        let achievementsOptions: any = achievementsConfiguration
        const defaultConfig: any = defaultModuleConfig

        let fileExtension = isTSFileAllowed ? 'ts' : 'js'
        let optionsFileExists = existsSync(`./achievements.config.${fileExtension}`)

        if (!optionsFileExists && fileExtension == 'ts' && isTSFileAllowed) {
            fileExtension = 'js'
            optionsFileExists = existsSync(`./achievements.config.${fileExtension}`)
        }

        if (optionsFileExists) {
            const slash = dirName.includes('\\') ? '\\' : '/'

            this._logger.debug(
                `Using configuration file at ${dirName}${slash}achievements.config.${fileExtension}...`, 'cyan'
            )

            try {

                // eslint-disable-next-line
                const optionsObject = require(`${dirName}/achievements.config.${fileExtension}`)

                options = optionsObject.optionsChecker
                achievementsOptions = optionsObject
            } catch (err: any) {
                this._logger.error(`Failed to open the configuration file:\n${err.stack}`)
                this._logger.debug('Using the configuration specified in a constructor...', 'cyan')
            }
        } else {
            this._logger.debug('Using the configuration specified in a constructor...', 'cyan')
        }

        const problems: string[] = []
        let output: any = {}

        const keys = Object.keys(defaultConfig)
        const optionKeys = Object.keys(achievementsOptions).filter(key => key !== 'mongo')

        if (options.ignoreUnspecifiedOptions === undefined) options.ignoreUnspecifiedOptions = true
        if (options.sendLog === undefined) options.sendLog = true
        if (options.showProblems === undefined) options.showProblems = true

        if (achievementsOptions.json && achievementsOptions.mongo) {
            this._logger.warn('You cannot use both JSON and MongoDB databases at the same time.')
            this._logger.warn('Using the JSON database, "options.mongo" object will be ignored.')

            delete achievementsOptions.mongo
        }

        if (typeof achievementsOptions !== 'object' && !Array.isArray(achievementsOptions)) {
            problems.push('options is not an object. Received type: ' + typeof achievementsOptions)
            output = defaultConfig
        } else {
            for (const i of keys) {
                if (achievementsOptions[i] == undefined) {
                    if (i !== 'json') {
                        output[i] = defaultConfig[i]
                    }

                    if (!options.ignoreUnspecifiedOptions) {
                        problems.push(`options.${i} is not specified.`)
                    }
                }
                else {
                    output[i] = achievementsOptions[i]
                }

                for (const y of Object.keys(defaultConfig[i]).filter(key => isNaN(key as any))) {

                    if (achievementsOptions[i]?.[y] == undefined || output[i]?.[y] == undefined) {
                        try {
                            output[i][y] = defaultConfig[i][y]
                        } catch (_) { }

                        if (!options.ignoreUnspecifiedOptions) problems.push(`options.${i}.${y} is not specified.`)
                    }
                }

                if (typeof output[i] !== typeof defaultConfig[i]) {
                    if (!options.ignoreInvalidTypes) {
                        if (i == 'json' && achievementsConfiguration.databaseType !== DatabaseType.MONGODB) {
                            output[i] = defaultConfig[i]
                        } else {
                            if (i !== 'json') {
                                problems.push(
                                    `options.${i} is not a ${typeof defaultConfig[i]}. ` +
                                    `Received type: ${typeof output[i]}.`
                                )
                            }
                        }

                        output.mongo = achievementsOptions.mongo
                    }
                }

                for (const y of Object.keys(defaultConfig[i]).filter(key => isNaN(key as any))) {

                    if (typeof output[i]?.[y] !== typeof defaultConfig[i][y]) {
                        if (!options.ignoreInvalidTypes) {
                            if (i !== 'json') {
                                problems.push(
                                    `options.${i}.${y} is not a ${typeof defaultConfig[i][y]}. ` +
                                    `Received type: ${typeof output[i][y]}.`
                                )

                                output[i][y] = defaultConfig[i][y]
                            }
                        }
                    }

                    else { }
                }
            }

            for (const i of optionKeys) {
                const defaultIndex = keys.indexOf(i)
                const objectKeys = Object.keys(achievementsOptions[i]).filter(key => isNaN(key as any))

                if (!achievementsOptions.mongo && achievementsOptions.json) {
                    if (
                        typeof achievementsOptions[i] !== 'object' &&
                        !Array.isArray(achievementsOptions[i])
                    ) {
                        if (i !== 'debug' && i !== 'databaseType') {
                            problems.push(
                                `options.${i} is not an object. ` +
                                `Received type: ${typeof achievementsOptions[i]}.`
                            )

                            delete output[i]
                        }
                    }
                }

                for (const y of objectKeys) {
                    const allKeys = Object.keys(defaultConfig[i] || {})
                    const index = allKeys.indexOf(y)

                    if (!allKeys[index]) {
                        problems.push(`options.${i}.${y} is an invalid option.`)
                        delete output[i]?.[y]
                    }
                }

                if (!keys[defaultIndex]) {
                    delete output[i]
                    problems.push(`options.${i} is an invalid option.`)
                }

            }
        }

        if (options.sendLog) {
            if (options.showProblems && problems.length) {
                console.log(
                    `Checked the options: ${problems.length ?
                        `${problems.length} problems found:\n\n${problems.join('\n')}` :
                        '0 problems found.'}`
                )
            }

            if (options.sendSuccessLog && !options.showProblems) {
                console.log(
                    `Checked the options: ${problems.length} ` +
                    `${problems.length == 1 ? 'problem' : 'problems'} found.`
                )
            }
        }

        if (output == defaultConfig) {
            return achievementsOptions
        } else {
            return output
        }
    }

    /**
     * Checks the database for errors.
     * @param {string} databaseContents Database file contents.
     * @returns {void}
     */
    public checkDatabase = (databaseContents: string): void => {
        try {
            JSON.parse(databaseContents)
        } catch (err: any) {
            if (err.message.includes('Unexpected token') ||
                err.message.includes('Unexpected end')
            ) {
                throw new AchievementsError(
                    errors.databaseFileMalformed,
                    ErrorCodes.STORAGE_FILE_ERROR
                )
            } else {
                throw err
            }
        }
    }

}
