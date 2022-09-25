import { Guild, GuildMember, TextChannel, User } from 'discord.js'
import { DatabaseProperties } from 'quick-mongo-super/typings/interfaces/QuickMongo'

import { Achievements } from '../Achievements'

import {
    AchievementType, IAchievement,
    IAchievementRequirement, ICompletion
} from '../types/achievement.interface'

import { CustomAchievementData } from '../types/customAchievementData.type'
import { AchievementsEvents } from '../types/events.interface'
import { StatusCode, TypeState } from '../types/status.interface'

import { Completions } from './Completions.achievement'
import { Progresses } from './Progresses.achievement'


/**
 * Achievement item class.
 *
 * Type parameters:
 *
 * - T (object): Optional object that would be stored in `custom` property of the achievement. Default: any.
 *
 * @implements {IAchievement<T>}
 */
export class Achievement<T extends object = any> implements IAchievement<T> {
    public achievements: Achievements<any>

    public readonly id: number
    public guildID: string

    public raw: IAchievement<T>

    public name: string
    public description: string
    public reward: number

    public completions: ICompletion[]
    public completionPercentage: number

    public icon?: string

    public trackingTarget: IAchievementRequirement
    public readonly createdAt: string

    public custom: CustomAchievementData<T>

    public readonly progresses: Progresses
    public readonly finishedCompletions: Completions


    constructor(achievementObject: IAchievement<T>, achievements: Achievements<any>) {

        /**
         * Achievements instance.
         * @type {Achievements}
         */
        this.achievements = achievements

        /**
         * Raw achievement object.
         * @type {IAchievement<T>}
         */
        this.raw = achievementObject

        /**
         * Achievement ID.
         * @type {number}
         * @readonly
         */
        this.id = achievementObject.id

        /**
         * Guild ID where the achievement was created.
         * @type {string}
         */
        this.guildID = achievementObject.guildID

        /**
         * Name of the achievement.
         * @type {string}
         */
        this.name = achievementObject.name

        /**
         * Description of the achievement.
         * @type {string}
         */
        this.description = achievementObject.description

        /**
         * Reward for the achievement.
         * @type {number}
         */
        this.reward = achievementObject.reward

        /**
         * Achievement completions.
         * @type {ICompletion[]}
         */
        this.completions = achievementObject.completions

        /**
         * Percent of guild members completed the achievement.
         * @type {number}
         */
        this.completionPercentage = achievementObject.completionPercentage

        /**
         * Requirement for the achievement for getting it that would be tracked automatically.
         * @type {IAchievementRequirement}
         */
        this.trackingTarget = achievementObject.trackingTarget || {} as any

        /**
         * Achievement icon.
         * @type {string}
         */
        this.icon = achievementObject.icon || null as any

        /**
         * Date when the achievement was created.
         * @type {string}
         * @readonly
         */
        this.createdAt = achievementObject.createdAt

        /**
         * Custom data for the achievement.
         * @type {CustomAchievementData<T>}
         */
        this.custom = achievementObject.custom || {} as any

        /**
         * Achievement progresses manager.
         * @type {Progresses}
         * @readonly
         */
        this.progresses = new Progresses(this)

        /**
         * Achievement completions manager.
         * @type {Completions}
         * @readonly
         */
        this.finishedCompletions = new Completions(this)
    }

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: string, channel: string): Promise<TypeState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: string): Promise<TypeState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in.
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: string, channel: TextChannel): Promise<TypeState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: TextChannel): Promise<TypeState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: string): Promise<TypeState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string | GuildMember} user User to grant the achievement to.
     * @param {string | TextChannel} channel The channel where the achievement was granted in
     * @returns {Promise<TypeState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(
        user: string | GuildMember,
        channel: string | TextChannel
    ): Promise<TypeState<'achievement', Achievement<T>>> {
        const userID = user instanceof GuildMember ? user.id : user
        const channelID = channel instanceof TextChannel ? channel.id : channel

        const guild = this.achievements.client.guilds.cache.get(this.guildID) as Guild

        const userInstance = user instanceof GuildMember ?
            user :
            guild.members.cache.get(userID)

        const channelInstance = channel instanceof TextChannel ?
            channel :
            guild.channels.cache.get(channelID)


        const userCompletion: ICompletion = {
            achievementID: this.id,
            userID,
            guildID: this.guildID,
            completedAt: new Date().toLocaleString(this.achievements.options.dateLocale)
        }

        await this.achievements.database.push(`${this.guildID}.${userID}.completedAchievements`, this.raw)

        this.completions.push(userCompletion)
        this.progresses.set(userID, 100)

        await this.update(true)

        this.achievements.emit(AchievementsEvents.ACHIEVEMENT_COMPLETE, {
            guild: guild as Guild,
            user: userInstance as GuildMember,
            channel: channelInstance as TextChannel,
            achievement: this
        })

        return {
            type: StatusCode.OK,
            status: true,
            message: 'OK',
            achievement: this
        }
    }

    /**
     * Whether the achievement is completed by a user.
     * @param {string}user User ID to check.
     * @returns {boolean} Whether the achievement is completed by the user.
     */
    public isCompleted(user: string): boolean

    /**
     * Whether the achievement is completed by a user.
     * @param {GuildMember} user User to check.
     * @returns {boolean} Whether the achievement is completed by the user.
     */
    public isCompleted(user: GuildMember): boolean

    /**
     * Whether the achievement is completed by a user.
     * @param {string | GuildMember} user User to check.
     * @returns {boolean} Whether the achievement is completed by the user.
     */
    public isCompleted(user: string | GuildMember): boolean {
        const userID = user instanceof GuildMember ? user.id : user

        return this.completions.some(
            completion => completion.userID === userID &&
                completion.achievementID == this.id
        )
    }

    /**
     * Updates the achievement in database.
     * @param {boolean} [updateCompletionPercent=false]
     * If true, percent of the guild members why completed the achievement will be updated.
     * @returns {Promise<DatabaseProperties<Required<IAchievement<T>>>>}
     */
    public async update(updateCompletionPercent = false): Promise<DatabaseProperties<Required<IAchievement<T>>>> {
        const achievements = await this.achievements.all(this.guildID)
        const achievementIndex = achievements.findIndex(a => a.id == this.id)

        const achievementObject: any = {
            ...this
        }

        if (updateCompletionPercent) {
            await this.updateGuildCompletionPercentage()
        }

        delete achievementObject.raw
        delete achievementObject.achievements
        delete achievementObject.progresses
        delete achievementObject.finishedCompletions

        const result = await this.achievements.database.pull(
            `${this.guildID}.achievements`,
            achievementIndex,
            achievementObject
        )

        //console.log(achievementObject)
        return result
    }

    /**
     * Updates the achievement completion percentage.
     * @returns {Promise<DatabaseProperties<Required<IAchievement<T>>>> }
     */
    public async updateGuildCompletionPercentage(
        type?: CompletionPercentageUpdateType
    ): Promise<DatabaseProperties<Required<IAchievement<T>>>> {
        const guildToChange = this.achievements.client.guilds.cache.get(this.guildID) as Guild
        const operation = type ? type as any == CompletionPercentageUpdateType.MEMBER_ADD ? - 1 : + 1 : + 0
        // console.log({ operation })
        this.completionPercentage = parseInt(
            (
                this.completions.length /
                (guildToChange.memberCount - guildToChange.members.cache.filter(m => m.user.bot).size + operation)
                * 100
            ).toFixed(2)
        )

        // console.log((
        //     this.completions.length /
        //     (guildToChange.memberCount - guildToChange.members.cache.filter(m => m.user.bot).size + operation)
        //     * 100
        // ).toFixed(2))//this.completionPercentage)
        const result = await this.update()
        //console.log(result)//.completionPercentage)
        return result
    }

    /**
     * Delete the achievement.
     * @param {string} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete(guild: string): Promise<Achievement<T>>

    /**
     * Delete the achievement.
     * @param {Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete(guild: Guild): Promise<Achievement<T>>

    /**
     * Delete the achievement.
     * @param {string | Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    public async delete(guild: string | Guild): Promise<Achievement<T>> {
        const guildID = guild instanceof Guild ? guild?.id : guild

        const achievements = await this.achievements.all(guildID)
        const achievementIndex = achievements.findIndex(achievement => achievement.id == this.id)

        await this.achievements.database.pop(`${guildID}.achievements`, achievementIndex)
        return this
    }

    /**
     * Handles a progress update for the specified achievement type.
     * @param {AchievementType} achievementType Achievement type to check.
     * @param {User} author Message author object.
     * @param {TextChannel} channel Text channel object.
     * @returns {Promise<void>}
     */
    public async handleProgressUpdate(
        achievementType: AchievementType,
        data: any,
        author: User,
        channel: TextChannel
    ): Promise<void> {
        const database = this.achievements.database
        const client = this.achievements.client

        const plugins = this.achievements.plugins

        const achievements = await this.achievements.all(this.guildID)
        const guild = this.achievements.client.guilds.cache.get(this.guildID)

        if (!author.bot) {
            const member = guild?.members.cache.get(author?.id)

            switch (achievementType) {
                case AchievementType.MESSAGES:
                    const messageAchievements = achievements
                        .filter(achievement => achievement.trackingTarget.type == AchievementType.MESSAGES)

                    if (messageAchievements.length) {
                        for (const achievement of messageAchievements) {
                            const achievementTarget = achievement.trackingTarget.target

                            if (!achievement.isCompleted(author.id)) {
                                const messagesAmount = (
                                    await database.get(`${this.guildID}.${author.id}.messages`)
                                ) || 0

                                const progressPercent = Math.floor(messagesAmount / achievementTarget * 100)

                                if (achievement.icon == '📨 I') {
                                    // console.log({
                                    //     progressToSet: progressPercent,
                                    //     achievement: `[${achievement.icon}] ${achievement.name}`
                                    // })
                                }

                                if (progressPercent < 100) {
                                    const progress = await achievement.progresses.set(
                                        author.id,
                                        progressPercent
                                    )

                                    this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                        guild: guild as Guild,
                                        user: member as GuildMember,
                                        achievement,

                                        ...progress
                                    })
                                }

                                if (achievement.icon == '📨 I') {
                                    // console.log({
                                    //     progressPercent,
                                    //     achievement: `[${achievement.icon}] ${achievement.name}`
                                    // })
                                }

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                }
                            }
                        }
                    }
                    break

                case AchievementType.LEVELS:
                    const levelsAchievements = achievements
                        .filter(achievement => achievement.trackingTarget.type == AchievementType.LEVELS)

                    if (levelsAchievements.length) {
                        for (const achievement of levelsAchievements) {
                            const achievementTarget = achievement.trackingTarget.target

                            if (!achievement.isCompleted(data.user.id)) {
                                const levels = plugins.leveling?.levels.get(author.id, this.guildID) || 0

                                const progressPercent = Math.floor(levels / achievementTarget * 100)

                                if (progressPercent < 100) {
                                    const progress = await achievement.progresses.set(data.user.id, progressPercent)
                                    const guild = client.guilds?.cache?.get(data.guildID)

                                    this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                        guild: guild as Guild,
                                        user: member as GuildMember,
                                        achievement,
                                        ...progress
                                    })
                                }

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                }
                            }
                        }
                    }
                    break

                case AchievementType.XP:
                    const xpAchievements = achievements
                        .filter(achievement => achievement.trackingTarget.type == AchievementType.XP)

                    if (xpAchievements.length) {
                        for (const achievement of xpAchievements) {
                            const achievementTarget = achievement.trackingTarget.target

                            if (!achievement.isCompleted(data.userID)) {
                                const xp = data.totalXP - data.gainedXP
                                const progressPercent = Math.floor(xp / achievementTarget * 100)

                                if (progressPercent < 100) {
                                    const progress = await achievement.progresses.set(data.userID, progressPercent)
                                    const guild = client.guilds?.cache?.get(data.guildID)

                                    this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                        guild: guild as Guild,
                                        user: member as GuildMember,
                                        achievement,
                                        ...progress
                                    })
                                }

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                }
                            }
                        }
                    }
                    break

                case AchievementType.MONEY:
                    const balanceAchievements = achievements
                        .filter(achievement => achievement.trackingTarget.type == AchievementType.MONEY)

                    if (balanceAchievements.length) {
                        for (const achievement of balanceAchievements) {
                            const achievementTarget = achievement.trackingTarget.target

                            if (!achievement.isCompleted(data.memberID)) {
                                const balance = data.balance
                                const progressPercent = Math.floor(balance / achievementTarget * 100)

                                if (progressPercent < 100) {
                                    const progress = await achievement.progresses.set(data.memberID, progressPercent)
                                    const guild = client.guilds?.cache?.get(data.guildID)

                                    this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                        guild: guild as Guild,
                                        user: member as GuildMember,
                                        achievement,
                                        ...progress
                                    })
                                }

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                }

                            }
                        }
                    }
                    break
            }
        }
    }

    /**
     * Handles a progress updates for the specified achievement types.
     * @param {any[]} achievementData
     * An array of 2-elements arrays of achievement types to check and data to pass in for each achievement type.
     *
     * @param {User} author Message author object.
     * @param {TextChannel} channel Text channel object.
     * @returns {Promise<void>}
     */
    public async handleManyProgressUpdates(
        achievementData: [AchievementType, any][],
        author: User,
        channel: TextChannel
    ): Promise<void> {
        for (const [achievementType, data] of achievementData) {
            await this.handleProgressUpdate(achievementType, data, author, channel)
        }
    }
}

export enum CompletionPercentageUpdateType {
    MEMBER_ADD = 0,
    MEMBER_REMOVE = 1
}

/**
 * @typedef {object} CompletionPercentageUpdateType
 * @prop {number} MEMBER_ADD Member add completion percentage update type.
 * @prop {number} MEMBER_REMOVE Member remove completion percentage update type.
 */
