import { GuildMember } from 'discord.js';
import { IProgression } from '../types/achievement.interface';
import { Achievement } from './Achievement';
/**
 * Achievement progressions manager class.
 */
export declare class Progresses {
    achievement: Achievement;
    private database;
    constructor(achievement: Achievement);
    /**
     * Sets the progress of the achievement for the specified user.
     * @param {string} user
     * @param {number} value Percentage of the achievement completed.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    set(user: string, value: number): Promise<IProgression>;
    /**
     * Sets the progress of the achievement for the specified user.
     * @param {GuildMember} user
     * @param {number} value Percentage of the achievement completed.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    set(user: GuildMember, value: number): Promise<IProgression>;
    /**
     * Resets the progress of the achievement for the specified user.
     * @param {string} user
     * @returns {Promise<IProgression>} The updated progression object.
     */
    reset(user: string, value: number): Promise<IProgression>;
    /**
     * Resets the progress of the achievement for the specified user.
     * @param {GuildMember} user
     * @returns {Promise<IProgression>} The updated progression object.
     */
    reset(user: GuildMember, value: number): Promise<IProgression>;
    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    get(user: string): Promise<IProgression>;
    /**
     * Gets the specified user's progression towards the achievement.
     * @param {GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    get(user: GuildMember): Promise<IProgression>;
    /**
     * Gets the specified user's progression towards the achievement.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    delete(user: string): Promise<IProgression>;
    /**
     * Gets the specified user's progression towards the achievement.
     * @param {GuildMember} user The user to delete the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    delete(user: GuildMember): Promise<IProgression>;
    /**
     * Gets all the progresses the user.
     * @param {string} user The user ID to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    all(user: string): Promise<IProgression[]>;
    /**
     * Gets all the progresses the user.
     * @param {GuildMember} user The user to get the progression of.
     * @returns {Promise<IProgression>} The updated progression object.
     */
    all(user: GuildMember): Promise<IProgression[]>;
}
