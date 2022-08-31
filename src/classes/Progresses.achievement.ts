import { GuildMember } from 'discord.js'
import { DatabaseManager } from '../managers/DatabaseManager'
import { ErrorCodes } from '../structures/ErrorCodes'
import { errors } from '../structures/errors.constant'
import { IProgression } from '../types/achievement.interface'
import { Achievement } from './Achievement'
import { AchievementsError } from './AchievementsError'

export class Progresses {
    public achievement: Achievement
    public database: DatabaseManager

    constructor(achievement: Achievement) {
        this.achievement = achievement
        this.database = achievement.achievements.database
    }

    /**
     * Sets the progress of the achievement for the specified user.
     * @param {string} user
     * @param {number} value Percentage of the achievement completed.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async set(user: string, value: number): Promise<IProgression>

    /**
     * Sets the progress of the achievement for the specified user.
     * @param {GuildMember} user
     * @param {number} value Percentage of the achievement completed.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async set(user: GuildMember, value: number): Promise<IProgression>

    /**
     * Sets the progress of the achievement for the specified user.
     * @param {string | GuildMember} user
     * @param {number} value Percentage of the achievement completed.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async set(user: string | GuildMember, value: number): Promise<IProgression> {
        const userID = user instanceof GuildMember ? user.id : user

        const progresses = (
            await this.database.get<IProgression[]>(`${this.achievement.guildID}.${userID}.progresses`)
        ) || []

        const achievementProgressIndex = progresses.findIndex(progress => progress.achievementID == this.achievement.id)
        const achievementProgress = progresses[achievementProgressIndex]

        if (!achievementProgress) {
            const progressObject: IProgression = {
                achievementID: this.achievement.id,
                achievementName: this.achievement.name,
                progress: value
            }

            await this.database.push<IProgression>(`${this.achievement.guildID}.${userID}.progresses`, progressObject)
            return progressObject
        }

        achievementProgress.progress = value

        await this.database.pull(
            `${this.achievement.guildID}.${userID}.progresses`,
            achievementProgressIndex,
            achievementProgress
        )

        return achievementProgress
    }

    /**
     * Resets the progress of the achievement for the specified user.
     * @param {string} user
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async reset(user: string, value: number): Promise<IProgression>

    /**
     * Resets the progress of the achievement for the specified user.
     * @param {GuildMember} user
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async reset(user: GuildMember, value: number): Promise<IProgression>

    /**
     * Resets the progress of the achievement for the specified user.
     * @param {string | GuildMember} user
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async reset(user: string | GuildMember): Promise<IProgression> {
        const userID = user instanceof GuildMember ? user.id : user

        const progresses = (
            await this.database.get<IProgression[]>(`${this.achievement.guildID}.${userID}.progresses`)
        ) || []

        const achievementProgressIndex = progresses.findIndex(progress => progress.achievementID == this.achievement.id)
        const achievementProgress = progresses[achievementProgressIndex]

        if (!achievementProgress) {
            throw new AchievementsError(
                errors.achievements.notFound(this.achievement.id),
                ErrorCodes.ACHIEVEMENT_NOT_FOUND
            )
        }

        achievementProgress.progress = 0

        await this.database.pull(
            `${this.achievement.guildID}.${userID}.progresses`,
            achievementProgressIndex,
            achievementProgress
        )

        return achievementProgress
    }

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async get(user: string): Promise<IProgression>

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async get(user: GuildMember): Promise<IProgression>

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string | GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async get(user: string | GuildMember): Promise<IProgression> {
        const userID = user instanceof GuildMember ? user.id : user

        const progresses = await this.all(userID)

        const achievementProgressIndex = progresses.findIndex(progress => progress.achievementID == this.achievement.id)
        const achievementProgress = progresses[achievementProgressIndex]

        return achievementProgress || {
            achievementID: this.achievement.id,
            achievementName: this.achievement.name,
            progress: 0
        }
    }

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async delete(user: string): Promise<IProgression>

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {GuildMember} user The user to delete the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async delete(user: GuildMember): Promise<IProgression>

    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string | GuildMember} user The user to delete the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async delete(user: string | GuildMember): Promise<IProgression> {
        const userID = user instanceof GuildMember ? user.id : user

        const progresses = (
            await this.database.get<IProgression[]>(`${this.achievement.guildID}.${userID}.progresses`)
        ) || []

        const achievementProgressIndex = progresses.findIndex(progress => progress.achievementID == this.achievement.id)
        const achievementProgress = progresses[achievementProgressIndex]

        if (!achievementProgress) {
            throw new AchievementsError(
                errors.achievements.notFound(this.achievement.id),
                ErrorCodes.ACHIEVEMENT_NOT_FOUND
            )
        }

        await this.database.pop(
            `${this.achievement.guildID}.${userID}.progresses`,
            achievementProgressIndex
        )

        return achievementProgress
    }


    /**
     * Gets all the progresses the user.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async all(user: string): Promise<IProgression[]>

    /**
     * Gets all the progresses the user.
     * @param {GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async all(user: GuildMember): Promise<IProgression[]>

    /**
     * Gets all the progresses the user.
     * @param {string | GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    public async all(user: string | GuildMember): Promise<IProgression[]> {
        const userID = user instanceof GuildMember ? user.id : user

        const progresses = (
            await this.database.get<IProgression[]>(`${this.achievement.guildID}.${userID}.progresses`)
        ) || []

        return progresses
    }
}
