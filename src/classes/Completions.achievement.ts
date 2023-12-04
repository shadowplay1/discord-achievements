import { GuildMember } from 'discord.js'

import { DatabaseManager } from '../managers/DatabaseManager'

import { ErrorCodes } from '../structures/ErrorCodes'
import { errors } from '../structures/errors.constant'

import { ICompletion } from '../types/achievement.interface'

import { Achievement } from './Achievement'
import { AchievementsError } from './AchievementsError'

/**
 * Achievement completions manager class.
 */
export class Completions {
    public achievement: Achievement
    private database: DatabaseManager

    constructor(achievement: Achievement) {

        /**
         * Achievement object that will be edited.
         * @type {Achievement}
         */
        this.achievement = achievement

        /**
         * Database manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = achievement.achievements.database
    }

    /**
     * Sets the the achievement as completed for the specified user.
     * @param {string} user The user ID to set the completion to.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async add(user: string): Promise<ICompletion>

    /**
     * Sets the the achievement as completed for the specified user.
     * @param {GuildMember} user The user to set the completion to.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async add(user: GuildMember): Promise<ICompletion>

    /**
     * Sets the the achievement as completed for the specified user.
     * @param {string | GuildMember} user The user to set the completion to.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async add(user: string | GuildMember): Promise<ICompletion> {
        const userID = user instanceof GuildMember ? user.id : user

        const completions = (
            await this.database.get<ICompletion[]>(`${this.achievement.guildID}.${userID}.completions`)
        ) || []

        const achievementCompletionIndex = completions
            .findIndex(completion => completion.achievementID == this.achievement.id) || 0


        const achievementCompletion = completions[achievementCompletionIndex]

        if (!achievementCompletion) {
            const completionObject: ICompletion = {
                achievementID: this.achievement.id,
                icon: this.achievement.icon,
                guildID: this.achievement.guildID,
                userID,
                completedAt: new Date().toLocaleString(this.achievement.achievements.options.dateLocale)
            }

            await this.database.push<ICompletion>(`${this.achievement.guildID}.${userID}.completions`, completionObject)
            return completionObject
        }

        await this.database.pull(
            `${this.achievement.guildID}.${userID}.completions`,
            achievementCompletionIndex,
            achievementCompletion
        )

        return achievementCompletion
    }

    /**
     * Gets the specified user's completion towards the achievement.
     * @param {string} user The user ID to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async get(user: string): Promise<ICompletion>

    /**
     * Gets the specified user's completion towards the achievement.
     * @param {GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async get(user: GuildMember): Promise<ICompletion>

    /**
     * Gets the specified user's completion towards the achievement.
     * @param {string | GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async get(user: string | GuildMember): Promise<ICompletion> {
        const userID = user instanceof GuildMember ? user.id : user

        const completions = (
            await this.database.get<ICompletion[]>(`${this.achievement.guildID}.${userID}.completions`)
        ) || []

        const achievementCompletionIndex = completions
            .findIndex(completion => completion.achievementID == this.achievement.id)

        const achievementCompletion = completions[achievementCompletionIndex]

        if (!achievementCompletion) {
            throw new AchievementsError(
                errors.achievements.notFound(this.achievement.id),
                ErrorCodes.ACHIEVEMENT_NOT_FOUND
            )
        }

        return achievementCompletion
    }

    /**
     * Deletes the specified user's achievement completion.
     * @param {string} user The user ID to delete the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async delete(user: string): Promise<ICompletion>

    /**
     * Deletes the specified user's achievement completion.
     * @param {GuildMember} user The user to delete the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async delete(user: GuildMember): Promise<ICompletion>

    /**
     * Deletes the specified user's achievement completion.
     * @param {string | GuildMember} user The user to delete the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async delete(user: string | GuildMember): Promise<ICompletion> {
        const userID = user instanceof GuildMember ? user.id : user

        const completions = (
            await this.database.get<ICompletion[]>(`${this.achievement.guildID}.${userID}.completions`)
        ) || []

        const achievementCompletionIndex = completions
            .findIndex(completion => completion.achievementID == this.achievement.id)

        const achievementCompletion = completions[achievementCompletionIndex]

        if (!achievementCompletion) {
            throw new AchievementsError(
                errors.achievements.notFound(this.achievement.id),
                ErrorCodes.ACHIEVEMENT_NOT_FOUND
            )
        }

        await this.database.pop(
            `${this.achievement.guildID}.${userID}.completions`,
            achievementCompletionIndex
        )

        return achievementCompletion
    }

    /**
     * Gets all the completions of the user.
     * @param {string} user The user ID to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async all(user: string): Promise<ICompletion[]>

    /**
     * Gets all the completions of the user.
     * @param {GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async all(user: GuildMember): Promise<ICompletion[]>

    /**
     * Gets all the completions of the user.
     * @param {string | GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    public async all(user: string | GuildMember): Promise<ICompletion[]> {
        const userID = user instanceof GuildMember ? user.id : user

        const completions = (
            await this.database.get<ICompletion[]>(`${this.achievement.guildID}.${userID}.completions`)
        ) || []

        return completions
    }
}
