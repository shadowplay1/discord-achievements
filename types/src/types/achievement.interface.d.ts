import { Guild, GuildMember, TextChannel } from 'discord.js';
import { If } from './misc/If.type';
import { Achievement } from '../classes/Achievement';
import { CustomAchievementData } from './customAchievementData.type';
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
     * Achievement icon.
     */
    icon?: string;
    /**
     * Requirement for the achievement for getting it that would be tracked automatically.
     */
    trackingTarget?: IAchievementRequirement;
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
     * Achievement icon.
     */
    achievementIcon?: string;
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
export declare type IProgression<AdditionalInfoProvided extends boolean = false> = If<AdditionalInfoProvided, IBaseProgression & IAdditionalInfo, IBaseProgression>;
export declare enum AchievementType {
    MONEY = 0,
    MESSAGES = 1,
    LEVELS = 2,
    XP = 3
}
export interface IAchievementRequirement {
    type: AchievementType;
    target: number;
}
export interface IAdditionalInfo {
    /**
     * Guild object.
     */
    guild: Guild;
    /**
     * User object.
     */
    user: GuildMember;
    /**
     * Achievement object.
     */
    achievement: Achievement;
}
/**
 * @typedef {object} IAchievement Achievement object interface.
 *
 * Type parameters:
 *
 * - T (object): Optional object that would be stored in `custom` property of the achievement. Default: any.
 *
 * @prop {number} id Achievement ID.
 * @prop {string} guildID Guild ID where the achievement was created.
 * @prop {string} name Name of the achievement.
 * @prop {string} description Description of the achievement.
 * @prop {number} reward Reward for the achievement.
 * @prop {string} [icon] Achievement icon.
 * @prop {IAchievementRequirement} [trackingTarget]
 * Requirement for the achievement for getting it that would be tracked automatically.
 *
 * @prop {ICompletion[]} completions Achievement completions array.
 * @prop {number} completionPercentage Percent of guild members completed the achievement.
 * @prop {string} createdAt Date when the achievement was created.
 * @prop {CustomAchievementData<T>} [custom] Custom data for the achievement.
 */
/**
 * @typedef {object} ICompletion Achievement completion object.
 * @prop {number} achievementID Achievement ID.
 * @prop {string} [icon] Achievement icon.
 * @prop {string} guildID Guild ID where the achievement was completed.
 * @prop {string} userIDUser ID who completed the achievement.
 * @prop {string} completedAt Date when the achievement was completed.
 */
/**
 * @typedef {object} IBaseProgression Base achievement progression object.
 * @prop {number} achievementID Achievement ID.
 * @prop {string} achievementName Achievement ID.
 * @prop {number} progress Percentage of the achievement completed.
 */
/**
 * @typedef {object} ICompletionEvent Achievement completion event object.
 * @prop {Guild} guild The where the achievement was completed.
 * @prop {GuildMember} user The user who completed the achievement.
 * @prop {Achievement} achievement The achievement that was completed.
 * @prop {TextChannel} channel The channel where the achievement was completed.
 */
/**
 * @typedef {object} IAdditionalInfo Additional information object for the achievement.
 * @prop {Guild} guild Guild object.
 * @prop {GuildMember} user User object.
 * @prop {Achievement} achievement Achievement object.
 */
/**
 * @typedef {object} IProgression Achievement progression object.
 *
 * Type parameters:
 *
 * - AdditionalInfoProvided (boolean): Optional. Sets to `true` if {@link IAdditionalInfo} will be provided.
 * Otherwise, the type of this object is {@link IBaseProgression}
 */
/**
 * @typedef {object} AchievementType Achievement types.
 * @prop {number} MONEY All achievements' proggreses will be updated on `balanceAdd` event of Economy.
 * @prop {number} MESSAGES All achievements' proggreses will be updated on `messageCreate` event of a Discord Client.
 * @prop {number} LEVELS All achievements' proggreses will be updated on `levelUp` event of Leveling.
 * @prop {number} XP All achievements' proggreses will be updated on `addXP` event of Leveling.
 */
/**
 * @typedef {object} IAchievementRequirement Requirement object for the achievement that will be tracked automatically.
 * @prop {AchievementType} type Type of the requirement.
 * @prop {number} target Target value to complete the achievement.
 */
