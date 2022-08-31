import { GuildMember } from 'discord.js';
import { ICompletion } from '../types/achievement.interface';
import { Achievement } from './Achievement';
/**
 * Achievement completions manager class.
 */
export declare class Completions {
    achievement: Achievement;
    private database;
    constructor(achievement: Achievement);
    /**
     * Sets the the achievement as completed for the specified user.
     * @param {string} user The user ID to set the completion to.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    add(user: string): Promise<ICompletion>;
    /**
     * Sets the the achievement as completed for the specified user.
     * @param {GuildMember} user The user to set the completion to.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    add(user: GuildMember): Promise<ICompletion>;
    /**
     * Gets the specified user's completion towards the achievement.
     * @param {string} user The user ID to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    get(user: string): Promise<ICompletion>;
    /**
     * Gets the specified user's completion towards the achievement.
     * @param {GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    get(user: GuildMember): Promise<ICompletion>;
    /**
     * Deletes the specified user's achievement completion.
     * @param {string} user The user ID to delete the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    delete(user: string): Promise<ICompletion>;
    /**
     * Deletes the specified user's achievement completion.
     * @param {GuildMember} user The user to delete the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    delete(user: GuildMember): Promise<ICompletion>;
    /**
     * Gets all the completions of the user.
     * @param {string} user The user ID to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    all(user: string): Promise<ICompletion[]>;
    /**
     * Gets all the completions of the user.
     * @param {GuildMember} user The user to get the completion of.
     * @returns {Promise<ICompletion>} The updated completion object.
     */
    all(user: GuildMember): Promise<ICompletion[]>;
}
