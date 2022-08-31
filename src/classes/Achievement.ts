import { Guild, GuildMember, TextChannel, User } from 'discord.js'
import { DatabaseProperties } from 'quick-mongo-super/typings/interfaces/QuickMongo'

import { Achievements } from '../Achievements'

import {
    AchievementType, IAchievement,
    IAchievementRequirements, ICompletion
} from '../types/achievement.interface'

import { CustomAchievementData } from '../types/CustomAchievementData'
import { AchievementsEvents } from '../types/events.interface'
import { StatusCode, IState } from '../types/status.interface'

import { Completions } from './Completions.achievement'
import { Progresses } from './Progresses.achievement'


/**
 * Achievement item class.
 */
export class Achievement<T extends object = any> implements IAchievement<T> {

    /**
     * Achievements instance.
     * @type {Achievements}
     */
    public achievements: Achievements<any>

    /**
     * Achievement ID.
     */
    public readonly id: number

    /**
     * Raw achievement object.
     */
    public raw: IAchievement<T>

    /**
     * Guild ID where the achievement was created.
     * @type {string}
     */
    public guildID: string

    /**
     * Name of the achievement.
     * @type {string}
     */
    public name: string

    /**
     * Description of the achievement.
     * @type {string}
     */
    public description: string

    /**
     * Reward for the achievement.
     * @type {number}
     */
    public reward: number

    /**
     * Achievement completions.
     * @type {ICompletion[]}
     */
    public completions: ICompletion[]

    /**
     * Percent of guild members completed the achievement.
     * @type {number}
     */
    public completionPercentage: number

    /**
     * Achievement icon.
     * @type {number}
     */
    public icon?: string

    /**
     * Requirements for the achievement for getting it that would be tracked automatically.
     * @type {IAchievementRequirements}
     */
    public trackingTarget: IAchievementRequirements

    /**
     * Date when the achievement was created.
     * @type {string}
     */
    public readonly createdAt: string

    /**
     * Custom data for the achievement.
     * @type {CustomAchievementData<T>}
     */
    public custom: CustomAchievementData<T>

    /**
     * Achievement progresses manager.
     * @type {Progresses}
     */
    public progresses: Progresses

    /**
     * Achievement completions manager.
     * @type {Completions}
     */
    public finishedCompletions: Completions


    constructor(achievementObject: IAchievement<T>, achievements: Achievements<any>) {
        this.achievements = achievements
        this.raw = achievementObject

        this.id = achievementObject.id
        this.guildID = achievementObject.guildID

        this.name = achievementObject.name
        this.description = achievementObject.description
        this.reward = achievementObject.reward

        this.completions = achievementObject.completions
        this.completionPercentage = achievementObject.completionPercentage

        this.trackingTarget = achievementObject.trackingTarget || {} as any

        this.icon = achievementObject.icon || null as any
        this.createdAt = achievementObject.createdAt

        this.custom = achievementObject.custom || {} as any

        this.progresses = new Progresses(this)
        this.finishedCompletions = new Completions(this)
    }

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: string, channel: string): Promise<IState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: string): Promise<IState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: string, channel: TextChannel): Promise<IState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: TextChannel): Promise<IState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(user: GuildMember, channel: string): Promise<IState<'achievement', Achievement<T>>>

    /**
     * Grants the achievement to a user.
     * @param {string | GuildMember} user User to grant the achievement to.
     * @param {string | TextChannel} channel The channel where the achievement was granted in
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    public async grant(
        user: string | GuildMember,
        channel: string | TextChannel
    ): Promise<IState<'achievement', Achievement<T>>> {
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

        this.completionPercentage = parseInt(
            (
                this.completions.length /
                (guild.memberCount - guild.members.cache.filter(m => m.user.bot).size)
                * 100
            ).toFixed(2)
        )

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
     * @param {boolean} updateCompletionPercent
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

        this.completionPercentage = parseInt(
            (
                this.completions.length /
                (guildToChange.memberCount - guildToChange.members.cache.filter(m => m.user.bot).size) + operation
                * 100
            ).toFixed(2)
        )

        console.log({
            percent: parseInt(
                (
                    this.completions.length /
                    (guildToChange.memberCount - guildToChange.members.cache.filter(m => m.user.bot).size) + operation
                    * 100
                ).toFixed(2)
            )
        })

        const result = await this.update()
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

        const achievements = await this.achievements.all<T>(guildID)
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
                                const progress = await achievement.progresses.set(author.id, progressPercent)

                                const member = guild?.members.cache.get(author?.id)

                                this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                    guild: guild as Guild,
                                    user: member as GuildMember,
                                    achievement,

                                    ...progress
                                })

                                if (progressPercent >= 100 && !achievement.isCompleted(author.id)) {

                                    await achievement.grant(member as GuildMember, channel)
                                    await achievement.update()
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
                                const progress = await achievement.progresses.set(data.user.id, progressPercent)

                                const guild = client.guilds?.cache?.get(data.guildID)
                                const member = guild?.members.cache.get(data.user.id)

                                this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                    guild: guild as Guild,
                                    user: member as GuildMember,
                                    achievement,
                                    ...progress
                                })

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                    await achievement.update()
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
                                const progress = await achievement.progresses.set(data.userID, progressPercent)

                                const guild = client.guilds?.cache?.get(data.guildID)
                                const member = guild?.members.cache.get(data.userID)

                                this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                    guild: guild as Guild,
                                    user: member as GuildMember,
                                    achievement,
                                    ...progress
                                })

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                    await achievement.update()
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
                                const progress = await achievement.progresses.set(data.memberID, progressPercent)

                                const guild = client.guilds?.cache?.get(data.guildID)
                                const member = guild?.members.cache.get(data.memberID)

                                this.achievements.emit(AchievementsEvents.ACHIEVEMENT_PROGRESS, {
                                    guild: guild as Guild,
                                    user: member as GuildMember,
                                    achievement,
                                    ...progress
                                })

                                if (progressPercent >= 100) {
                                    await achievement.grant(member as GuildMember, channel)
                                    await achievement.update()
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
     * @param {AchievementType[]} achievementTypes Achievement types to check.
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
