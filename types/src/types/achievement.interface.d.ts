import { Guild, GuildMember, If, TextChannel } from 'discord.js';
import { Achievement } from '../classes/Achievement';
import { CustomAchievementData } from './CustomAchievementData';
export interface IAchievement<T extends object = any> {
    /**
     * Achievement ID.
     */
    id: number;
    /**
     * Guild ID where the achievement was created.
     */
    guildID: string;
    /**
     * Name of the achievement.
     */
    name: string;
    /**
     * Description of the achievement.
     */
    description: string;
    /**
     * Reward for the achievement.
     */
    reward: number;
    /**
     * Reward for the achievement.
     */
    icon?: string;
    /**
     * Requirement for the achievement for getting it that would be tracked automatically.
     */
    trackingTarget?: IAchievementRequirements;
    /**
     * Achievement completions.
     */
    completions: ICompletion[];
    /**
     * Percent of guild members completed the achievement.
     */
    completionPercentage: number;
    /**
     * Date when the achievement was created.
     * @type {string}
     */
    createdAt: string;
    /**
     * Custom data for the achievement.
     */
    custom?: CustomAchievementData<T>;
}
export interface ICompletion {
    /**
     * Achievement ID.
     */
    achievementID: number;
    /**
     * Achievement icon.
     */
    icon?: string;
    /**
     * Guild ID where the achievement was completed.
     */
    guildID: string;
    /**
     * User ID who completed the achievement.
     */
    userID: string;
    /**
     * Date when the achievement was completed.
     */
    completedAt: string;
}
export interface IBaseProgression {
    /**
     * Achievement ID.
     */
    achievementID: number;
    /**
     * Achievement name.
     */
    achievementName: string;
    /**
     * Percentage of the achievement completed.
     */
    progress: number;
}
export interface ICompletionEvent {
    /**
     * The where the achievement was completed.
     */
    guild: Guild;
    /**
     * The user who completed the achievement.
     */
    user: GuildMember;
    /**
     * The achievement that was completed.
     */
    achievement: Achievement;
    /**
     * The channel where the achievement was completed.
     */
    channel: TextChannel;
}
export declare type IProgression<AdditionalInfoProvided extends boolean = false> = If<AdditionalInfoProvided, IBaseProgression & {
    /**
     * The guids where the progress was updated.
     */
    guild: Guild;
    /**
     * User that the achievement progress was updated for.
     */
    user: GuildMember;
    /**
     * The achievement that was updated.
     */
    achievement: Achievement;
}, IBaseProgression>;
export declare enum AchievementType {
    MONEY = 0,
    MESSAGES = 1,
    LEVELS = 2,
    XP = 3
}
export interface IAchievementRequirements {
    type: AchievementType;
    target: number;
}
