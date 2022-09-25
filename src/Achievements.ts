import { existsSync, readFileSync, writeFileSync } from 'fs'

import { Client, Guild, TextChannel, User } from 'discord.js'
import QuickMongo from 'quick-mongo-super'

import { AchievementsError } from './classes/AchievementsError'
import { Emitter } from './classes/util/Emitter'

import { DatabaseManager } from './managers/DatabaseManager'
import { UtilsManager } from './managers/UtilsManager'

import { ErrorCodes } from './structures/ErrorCodes'
import { errors } from './structures/errors.constant'

import { DatabaseType, IAchievementsOptions, IAchievementsPlugins } from './types/options.interface'
import { Logger } from './classes/util/Logger'

import modulePackage from '../package.json'

import { AchievementsEvents, IAchievementsEvents } from './types/events.interface'
import { AchievementType, IAchievement } from './types/achievement.interface'

import { Achievement } from './classes/Achievement'
import { MongoConnectionOptions } from 'quick-mongo-super/typings/interfaces/QuickMongo'


/**
 * Main Achievements class.
 *
 * Type parameters:
 *
 * - IsMongoDBUsed (boolean): A boolean value that indicates whether the MongoDB database is used.
 *
 * @extends {Emitter}
 */
export class Achievements<IsMongoDBUsed extends boolean> extends Emitter {
    public ready: boolean

    public version: string
    public options: IAchievementsOptions<IsMongoDBUsed>

    public interval?: NodeJS.Timer
    public client: Client<boolean>

    public plugins: IAchievementsPlugins<IsMongoDBUsed>

    public database: DatabaseManager
    public mongo: QuickMongo

    public utils?: UtilsManager

    private managers: IManager<IsMongoDBUsed>[]
    private _logger: Logger

    /**
     * Achievements constructor.
     * @param {Client} client Discord Client.
     * @param {IAchievementsOptions<IsMongoDBUsed>} options Module configuration.
     */
    constructor(client: Client<boolean>, options: IAchievementsOptions<IsMongoDBUsed> = {} as any) {
        super()

        /**
         * Module ready state.
         * @type {boolean}
         */
        this.ready = false

        /**
         * Module version.
         * @type {string}
         */
        this.version = modulePackage.version

        /**
         * Discord Client.
         * @type {Client}
         */
        this.client = client

        /**
         * JSON database file checking interval.
         * @type {NodeJS.Timer}
         */
        this.interval = null as any

        /**
         * Module logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger({
            debug: options.debug
        })

        /**
        * Achievements managers list. Made for optimization purposes.
        * @type {Array<IManager<IsMongoDBUsed>>}
        * @private
        */
        this.managers = []

        if (options.debug) {
            this._logger.debug(`Achievements version: ${this.version}`, 'lightcyan')
        }

        /**
         * Utils Manager.
         * @type {UtilsManager}
         */
        this.utils = new UtilsManager(this, options)

        /**
         * Module configuration.
         * @type {IAchievementsOptions}
         */
        this.options = this.utils.checkOptions(options.optionsChecker, options) as any

        /**
         * Achievements plugins object.
         * @type {IAchievementsPlugins<IsMongoDBUsed>}
         */
        this.plugins = this.options.plugins as IAchievementsPlugins<IsMongoDBUsed>

        /**
         * Database Manager.
         * @type {DatabaseManager}
         */
        this.database = null as any

        /**
         * MongoDB Connection.
         * @type {QuickMongo}
         */
        this.mongo = null as any

        this._logger.debug('Achievements starting process launched.')
        this.init()
    }

    /**
     * Initialize the module.
     * @returns {Promise<void>}
     * @public
     */
    public async init(): Promise<void> {
        const options = this.options as any

        this._logger.debug('Checking the specified client...')

        if (!this.client) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"client" parameter in a main constructor'),
                ErrorCodes.NO_DISCORD_CLIENT
            )
        }

        if (!this.client.ws) {
            throw new AchievementsError(
                errors.invalidType('"client" parameter in a main constructor', 'Client instance', typeof this.client),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (
            options.databaseType == DatabaseType.JSON &&
            options.mongo
        ) {
            this.options.databaseType = DatabaseType.MONGODB
        }

        if (
            options.databaseType == DatabaseType.MONGODB &&
            options.json
        ) {
            this.options.databaseType = DatabaseType.JSON
        }

        this._logger.debug(`Using ${this.options.databaseType} database.`, 'lightcyan')

        if (options.databaseType == DatabaseType.JSON) {
            const path = options.json?.path as string
            const checkingInterval = options.json?.checkingInterval as number

            this._logger.debug('Checking the database file...')

            if (!this.options.databaseType) {
                throw new AchievementsError(
                    errors.requiredParameterMissing('"databaseType" option in a main constructor'),
                    ErrorCodes.REQUIRED_PARAMETER_MISSING
                )
            }

            if (!existsSync(path)) {
                writeFileSync(path, '{}')
                this._logger.debug(`Created a new '${options.json?.path}' file...`)
            }

            this._logger.debug('Checking the database file for any errors...')

            const databaseFile = readFileSync(path, 'utf8')
            this.utils?.checkDatabase(databaseFile)

            const interval = setInterval(() => {
                this.utils?.checkDatabase(databaseFile)
            }, checkingInterval)

            this.interval = interval
            this.initManagers()

            this.client.on('ready', () => {
                this.emit(AchievementsEvents.READY, this)
                this.ready = true
            })
        }

        if (options.databaseType == DatabaseType.MONGODB) {
            const connectionStartDate = Date.now()

            const mongo = options.mongo as Partial<MongoConnectionOptions>
            const db = new QuickMongo(mongo as MongoConnectionOptions)

            if (!mongo.connectionURI) {
                throw new AchievementsError(errors.noConnectionData, ErrorCodes.NO_CONNECTION_DATA)
            }

            this._logger.debug('Connecting to MongoDB...', 'lightgreen')

            await db.connect()
            this.mongo = db

            this._logger.debug(
                `MongoDB connection is established in ${Date.now() - connectionStartDate} ms.`, 'lightgreen'
            )

            this._logger.debug('Starting the managers...', 'lightyellow')
            this.initManagers()

            delete mongo.connectionURI

            this.emit(AchievementsEvents.READY, this)
            this.ready = true
        }

        if (this.plugins.economy) {
            if (this.plugins?.economy.constructor?.name !== 'Economy') {
                const eco = this.plugins.economy as any

                throw new AchievementsError(
                    errors.invalidType(
                        '"Economy" plugin',
                        'Economy instance',
                        eco?.constructor?.name ?
                            `${eco?.constructor?.name} instance` :
                            typeof eco
                    ),
                    ErrorCodes.INVALID_TYPE
                )
            }

            this._logger.debug('Economy plugin loaded.')
        }

        if (this.plugins.leveling) {
            if (this.plugins?.leveling.constructor?.name !== 'Leveling') {
                const leveling = this.plugins.leveling as any

                throw new AchievementsError(
                    errors.invalidType(
                        '"Leveling" plugin',
                        'Leveling instance',
                        leveling?.constructor?.name ?
                            `${leveling?.constructor?.name} instance` :
                            typeof leveling
                    ),
                    ErrorCodes.INVALID_TYPE
                )
            }

            this._logger.debug('Leveling plugin loaded.')
        }

        this.client.on('messageCreate', async message => {
            if (this.ready) {
                this.database.set(
                    `${message?.guild?.id}.${message?.author?.id}.lastMessageChannelID`,
                    message.channel.id
                )

                if (!message.author.bot) {
                    const achievements = await this.all(message?.guild?.id as string)
                    const messageAchievements = achievements.filter(a => a.trackingTarget.type == AchievementType.MESSAGES)

                    await this.database.add(`${message?.guild?.id}.${message?.author?.id}.messages`, 1)

                    for (const achievement of messageAchievements) {
                        // console.log({
                        //     progressInManager: await achievement.progresses.get(message.author.id),
                        //     achievementName: `[${achievement.icon}] ${achievement.name}`
                        // })
                        achievement.handleProgressUpdate(
                            AchievementType.MESSAGES, null,
                            message.author, message.channel as TextChannel
                        )
                    }
                }
            }
        })

        this.plugins.leveling?.on('levelUp', async data => {
            if (this.ready) {
                const allAchievements = await this.all(data.guildID)
                const achievements = allAchievements.filter(a => a.trackingTarget.type == AchievementType.LEVELS)

                const channelID = await this.database.fetch(`${data.guildID}.${data.user.id}.lastMessageChannelID`)

                const channel = this.client.channels.cache.get(channelID)

                for (const achievement of achievements) {
                    if (!achievement.isCompleted(data.user.id)) {
                        await achievement.handleProgressUpdate(
                            AchievementType.LEVELS,
                            data,
                            data.user,
                            channel as TextChannel
                        )
                    }
                }
            }
        })

        this.plugins.leveling?.on('addTotalXP', async data => {
            if (this.ready) {
                const allAchievements = await this.all(data.guildID)
                const achievements = allAchievements.filter(a => a.trackingTarget.type == AchievementType.XP)

                const channelID = await this.database.fetch(`${data.guildID}.${data.userID}.lastMessageChannelID`)

                const user = this.client.users.cache.get(data.userID)
                const channel = this.client.channels.cache.get(channelID)

                for (const achievement of achievements) {
                    if (!achievement.isCompleted(data.userID)) {
                        await achievement.handleProgressUpdate(
                            AchievementType.XP,
                            data,
                            user as User,
                            channel as TextChannel
                        )
                    }
                }
            }
        })

        this.plugins.economy?.on('balanceAdd', async data => {
            if (this.ready) {
                const allAchievements = await this.all(data.guildID)
                const achievements = allAchievements.filter(a => a.trackingTarget.type == AchievementType.MONEY)

                const channelID = await this.database.fetch(`${data.guildID}.${data.memberID}.lastMessageChannelID`)

                const user = this.client.users.cache.get(data.memberID)
                const channel = this.client.channels.cache.get(channelID)

                for (const achievement of achievements) {
                    if (!achievement.isCompleted(data.memberID)) {
                        await achievement.handleProgressUpdate(
                            AchievementType.MONEY,
                            data,
                            user as User,
                            channel as TextChannel
                        )
                    }
                }
            }
        })

        this.client.on('guildMemberAdd', async member => {
            const achievements = await this.all(member.guild.id)
            // console.log(1)

            for (const achievement of achievements) {
                await achievement.update(true)
            }
        })

        this.client.on('guildMemberRemove', async member => {
            const achievements = await this.all(member.guild.id)
            // console.log(2)

            for (const achievement of achievements) {
                await achievement.update(true)
            }
        })
    }

    /**
     * Initializes the managers.
     * @returns {void}
     * @private
     */
    private initManagers(): void {
        const managers = [
            {
                name: 'database',
                manager: DatabaseManager
            },
            {
                name: 'utils',
                manager: UtilsManager
            }
        ]

        const events: (keyof IAchievementsEvents)[] = [
            'ready',
            'destroy',
            'achievementProgress',
            'achievementComplete'
        ]

        for (const manager of managers) {
            const that: Record<string, any> = this

            that[manager.name] = new manager.manager(this as any, this.options)
            this._logger.debug(`${manager.manager.name} is started.`)
        }

        for (const event of events) {
            this.on(event, () => {
                this._logger.debug(`"${event}" event is emitted.`)
            })
        }
    }

    /**
     * Destroys the module.
     * @returns {void}
     */
    public kill(): void {
        const that: Record<string, any> = this

        for (const manager of this.managers) {
            that[manager.name] = null
        }

        this.managers = []
        clearInterval(this.interval)

        this.ready = false
        this.emit(AchievementsEvents.DESTROY)
    }

    /**
    * Create a new achievement.
    * @param {string} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObject The achievement's name.
    * @returns {Promise<Achievement<T>>} The created achievement.
    */
    public async create<
        T extends object = any
    >(
        guild: string,
        achievementObject: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >): Promise<Achievement<T>>

    /**
    * Create a new achievement.
    * @param {Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObject The achievement's name.
    * @returns {Promise<Achievement<T>>} The created achievement.
    */
    public async create<
        T extends object = any
    >(
        guild: Guild,
        achievementObject: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >): Promise<Achievement<T>>

    /**
    * Create a new achievement.
    * @param {string | Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObject The achievement's name.
    * @returns {Promise<Achievement<T>>} The created achievement.
    */
    public async create<
        T extends object = any
    >(
        guild: string | Guild,
        achievementObject: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >): Promise<Achievement<T>> {
        const guildID = guild instanceof Guild ? guild?.id : guild
        const achievements = await this.all(guildID)

        if (!achievementObject.name) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"name" option for AchievementManager.create() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (!achievementObject.description) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"description" option for AchievementManager.create() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (!achievementObject.reward) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"reward" option for AchievementManager.create() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }


        if (typeof achievementObject.reward !== 'number') {
            throw new AchievementsError(
                errors.invalidType(
                    '"reward" option for AchievementManager.create() method', 'number', typeof achievementObject.reward
                ),
                ErrorCodes.INVALID_TYPE
            )
        }

        const achievement = new Achievement({
            id: achievements.length == 0 ? 1 : achievements[achievements.length - 1].id + 1,
            guildID,
            completions: [],
            completionPercentage: 0,
            createdAt: new Date().toLocaleString(this.options.dateLocale),
            ...achievementObject
        }, this)

        await this.database.push(`${guildID}.achievements`, achievement.raw)
        return achievement
    }

    /**
    * Create a new achievement.
    * @param {string} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObjects The achievement's name.
    * @returns {Promise<Array<Achievement<T>>>} The created achievements array.
    */
    public async createMany<
        T extends object = any
    >(
        guild: string,
        ...achievementObjects: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >[]): Promise<Achievement<T>[]>

    /**
    * Create a new achievement.
    * @param {Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObjects The achievement's name.
    * @returns {Promise<Array<Achievement<T>>>} The created achievements array.
    */
    public async createMany<
        T extends object = any
    >(
        guild: Guild,
        ...achievementObjects: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >[]): Promise<Achievement<T>[]>

    /**
    * Create a new achievement.
    * @param {string | Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObjects The achievement's name.
    * @returns {Promise<Array<Achievement<T>>>} The created achievements array.
    */
    public async createMany<
        T extends object = any
    >(guild: string | Guild,
        ...achievementObjects: Omit<
            IAchievement<T>,
            'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'
        >[]): Promise<Achievement<T>[]> {
        const guildID = guild instanceof Guild ? guild?.id : guild
        const createdAchievements: Achievement<T>[] = []

        for await (const achievementObject of achievementObjects) {
            createdAchievements.push(
                await this.create(guildID, achievementObject)
            )
        }

        return createdAchievements
    }

    /**
     * Get all achievements for the specified guild.
     * @param {string} guild The guild to get achievements from.
     * @returns {Promise<Array<Achievement<T>>>} The achievements array.
     */
    public async all<T extends object = any>(guild: string): Promise<Achievement<T>[]>

    /**
     * Get all achievements for the specified guild.
     * @param {Guild} guild The guild to get achievements from.
     * @returns {Promise<Array<Achievement<T>>>} The achievements array.
     */
    public async all<T extends object = any>(guild: Guild): Promise<Achievement<T>[]>

    /**
     * Get all achievements for the specified guild.
     * @param {string | Guild} guild The guild to get achievements from.
     * @returns {Promise<Array<Achievement<T>>>} The achievements array.
     */
    public async all<T extends object = any>(guild: string | Guild): Promise<Achievement<T>[]> {
        const guildID = guild instanceof Guild ? guild?.id : guild
        const achievementObjects = (await this.database.get<IAchievement<T>[]>(`${guildID}.achievements`)) || []

        const result = achievementObjects.map(achievementObject => {
            return new Achievement({
                ...achievementObject,
                guildID
            }, this)
        })

        return result
    }

    /**
     * Get an achievement by its ID.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to get the achievement from.
     * @returns {Promise<Achievement<T>>} The achievement object.
     */
    public async get<T extends object = any>(id: number, guild: string): Promise<Achievement<T>>

    /**
     * Get an achievement by its ID.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to get the achievement from.
     * @returns {Promise<Achievement<T>>} The achievement object.
     */
    public async get<T extends object = any>(id: number, guild: Guild): Promise<Achievement<T>>

    /**
     * Get an achievement by its ID.
     * @param {number} id The achievement ID.
     * @param {string | Guild} guild The guild to get the achievement from.
     * @returns {Promise<Achievement<T>>} The achievement object.
     */
    public async get<T extends object = any>(id: number, guild: string | Guild): Promise<Achievement<T>> {
        const guildID = guild instanceof Guild ? guild?.id : guild

        const achievementObjects = (await this.database.get<IAchievement[]>(`${guildID}.achievements`)) || []
        const achievementObject = achievementObjects.find(achievementObject => achievementObject.id == id)

        if (!achievementObject) {
            return null as any
        }

        return new Achievement({
            ...achievementObject,
            guildID
        }, this)
    }

    /**
     * Get an achievement index by its ID.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to get the achievement from.
     * @returns {Promise<number>} The achievement object.
     */
    public async getIndex(id: number, guild: string): Promise<number>

    /**
     * Get an achievement index by its ID.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to get the achievement from.
     * @returns {Promise<number>} The achievement object.
     */
    public async getIndex(id: number, guild: Guild): Promise<number>

    /**
     * Get an achievement index by its ID.
     * @param {number} id The achievement ID.
     * @param {string | Guild} guild The guild to get the achievement from.
     * @returns {Promise<number>} The achievement object.
     */
    public async getIndex(id: number, guild: string | Guild): Promise<number> {
        const guildID = guild instanceof Guild ? guild?.id : guild

        const achievementObjects = await this.all(guildID)
        const achievementIndex = achievementObjects.findIndex(achievementObject => achievementObject.id == id)

        if (!achievementIndex) {
            return -1
        }
        return achievementIndex
    }

    /**
     * Delete the achievement.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete<T extends object = any>(id: number, guild: string): Promise<Achievement<T>>

    /**
     * Delete the achievement.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete<T extends object = any>(id: number, guild: Guild): Promise<Achievement<T>>

    /**
     * Delete the achievement.
     * @param {number} id The achievement ID.
     * @param {string | Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete<T extends object = any>(id: number, guild: string | Guild): Promise<Achievement<T>> {
        const guildID = guild instanceof Guild ? guild?.id : guild

        const achievements = await this.all(guildID)

        const achievement = achievements.find(achievement => achievement.id == id) as Achievement
        const achievementIndex = achievements.findIndex(achievement => achievement.id == id)

        if (!achievement) {
            throw new AchievementsError(
                errors.targetIsEmpty(`Achievement with ID ${id}`),
                ErrorCodes.INVALID_TARGET_TYPE
            )
        }

        await this.database.pop(`${guildID}.achievements`, achievementIndex)
        return achievement
    }
}

export interface IManager<IsMongoDBUsed extends boolean> {
    name: string,
    manager: new (achievements: Achievements<IsMongoDBUsed>, options?: IAchievementsOptions<IsMongoDBUsed>) => any
}


/**
* Emits when the module is ready.
* @event Achievements#ready
* @param {Achievements} achievements Achievements instance that was initialized and could be used.
*/

/**
* Emits when the module is destroyed.
* @event Achievements#destroy
*/

/**
 * Emits when the progress has been made on an achievement.
 * @event Achievements#achievementProgress
 * @param {IProgression<true>} progressionData Progression data object.
 */

/**
 * Emits when the progress has been made on an achievement.
 * @event Achievements#achievementComplete
 * @param {ICompletion} completionData Completion data object.
 */
