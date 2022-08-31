import { Guild, GuildMember, TextChannel, User } from 'discord.js';
import { DatabaseProperties } from 'quick-mongo-super/typings/interfaces/QuickMongo';
import { Achievements } from '../Achievements';
import { AchievementType, IAchievement, IAchievementRequirement, ICompletion } from '../types/achievement.interface';
import { CustomAchievementData } from '../types/CustomAchievementData';
import { IState } from '../types/status.interface';
import { Completions } from './Completions.achievement';
import { Progresses } from './Progresses.achievement';
/**
 * Achievement item class.
 *
 * Type parameters:
 *
 * - T (object): Optional object that would be stored in `custom` property of the achievement. Default: any.
 *
 * @implements {IAchievement<T>}
 */
export declare class Achievement<T extends object = any> implements IAchievement<T> {
    achievements: Achievements<any>;
    readonly id: number;
    guildID: string;
    raw: IAchievement<T>;
    name: string;
    description: string;
    reward: number;
    completions: ICompletion[];
    completionPercentage: number;
    icon?: string;
    trackingTarget: IAchievementRequirement;
    readonly createdAt: string;
    custom: CustomAchievementData<T>;
    readonly progresses: Progresses;
    readonly finishedCompletions: Completions;
    constructor(achievementObject: IAchievement<T>, achievements: Achievements<any>);
    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    grant(user: string, channel: string): Promise<IState<'achievement', Achievement<T>>>;
    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    grant(user: GuildMember, channel: string): Promise<IState<'achievement', Achievement<T>>>;
    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    grant(user: string, channel: TextChannel): Promise<IState<'achievement', Achievement<T>>>;
    /**
     * Grants the achievement to a user.
     * @param {string} user User ID to grant the achievement to.
     * @param {TextChannel} channel The channel where the achievement was granted in
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    grant(user: GuildMember, channel: TextChannel): Promise<IState<'achievement', Achievement<T>>>;
    /**
     * Grants the achievement to a user.
     * @param {GuildMember} user User to grant the achievement to.
     * @param {string} channel The channel where the achievement was granted in.
     * @returns {Promise<IState<'achievement', Achievement<T>>>} The granted achievement.
     */
    grant(user: GuildMember, channel: string): Promise<IState<'achievement', Achievement<T>>>;
    /**
     * Whether the achievement is completed by a user.
     * @param {string}user User ID to check.
     * @returns {boolean} Whether the achievement is completed by the user.
     */
    isCompleted(user: string): boolean;
    /**
     * Whether the achievement is completed by a user.
     * @param {GuildMember} user User to check.
     * @returns {boolean} Whether the achievement is completed by the user.
     */
    isCompleted(user: GuildMember): boolean;
    /**
     * Updates the achievement in database.
     * @param {boolean} updateCompletionPercent
     * If true, percent of the guild members why completed the achievement will be updated.
     * @returns {Promise<DatabaseProperties<Required<IAchievement<T>>>>}
     */
    update(updateCompletionPercent?: boolean): Promise<DatabaseProperties<Required<IAchievement<T>>>>;
    /**
     * Updates the achievement completion percentage.
     * @returns {Promise<DatabaseProperties<Required<IAchievement<T>>>> }
     */
    updateGuildCompletionPercentage(type?: CompletionPercentageUpdateType): Promise<DatabaseProperties<Required<IAchievement<T>>>>;
    /**
     * Delete the achievement.
     * @param {string} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    delete(guild: string): Promise<Achievement<T>>;
    /**
     * Delete the achievement.
     * @param {Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    delete(guild: Guild): Promise<Achievement<T>>;
    /**
     * Handles a progress update for the specified achievement type.
     * @param {AchievementType} achievementType Achievement type to check.
     * @param {User} author Message author object.
     * @param {TextChannel} channel Text channel object.
     * @returns {Promise<void>}
     */
    handleProgressUpdate(achievementType: AchievementType, data: any, author: User, channel: TextChannel): Promise<void>;
    /**
     * Handles a progress updates for the specified achievement types.
     * @param {AchievementType[]} achievementTypes Achievement types to check.
     * @param {User} author Message author object.
     * @param {TextChannel} channel Text channel object.
     * @returns {Promise<void>}
     */
    handleManyProgressUpdates(achievementData: [AchievementType, any][], author: User, channel: TextChannel): Promise<void>;
}
export declare enum CompletionPercentageUpdateType {
    MEMBER_ADD = 0,
    MEMBER_REMOVE = 1
}
/**
 * @typedef {object} CompletionPercentageUpdateType
 * @prop {number} MEMBER_ADD Member add completion percentage update type.
 * @prop {number} MEMBER_REMOVE Member remove completion percentage update type.
 */
