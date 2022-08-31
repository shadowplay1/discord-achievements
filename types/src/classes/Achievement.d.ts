import { Guild, GuildMember, TextChannel, User } from 'discord.js';
import { DatabaseProperties } from 'quick-mongo-super/typings/interfaces/QuickMongo';
import { Achievements } from '../Achievements';
import { AchievementType, IAchievement, IAchievementRequirements, ICompletion } from '../types/achievement.interface';
import { CustomAchievementData } from '../types/CustomAchievementData';
import { IState } from '../types/status.interface';
import { Completions } from './Completions.achievement';
import { Progresses } from './Progresses.achievement';
/**
 * Achievement item class.
 */
export declare class Achievement<T extends object = any> implements IAchievement<T> {
    /**
     * Achievements instance.
     * @type {Achievements}
     */
    achievements: Achievements<any>;
    /**
     * Achievement ID.
     */
    readonly id: number;
    /**
     * Raw achievement object.
     */
    raw: IAchievement<T>;
    /**
     * Guild ID where the achievement was created.
     * @type {string}
     */
    guildID: string;
    /**
     * Name of the achievement.
     * @type {string}
     */
    name: string;
    /**
     * Description of the achievement.
     * @type {string}
     */
    description: string;
    /**
     * Reward for the achievement.
     * @type {number}
     */
    reward: number;
    /**
     * Achievement completions.
     * @type {ICompletion[]}
     */
    completions: ICompletion[];
    /**
     * Percent of guild members completed the achievement.
     * @type {number}
     */
    completionPercentage: number;
    /**
     * Achievement icon.
     * @type {number}
     */
    icon?: string;
    /**
     * Requirements for the achievement for getting it that would be tracked automatically.
     * @type {IAchievementRequirements}
     */
    trackingTarget: IAchievementRequirements;
    /**
     * Date when the achievement was created.
     * @type {string}
     */
    readonly createdAt: string;
    /**
     * Custom data for the achievement.
     * @type {CustomAchievementData<T>}
     */
    custom: CustomAchievementData<T>;
    /**
     * Achievement progresses manager.
     * @type {Progresses}
     */
    progresses: Progresses;
    /**
     * Achievement completions manager.
     * @type {Completions}
     */
    finishedCompletions: Completions;
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
