/// <reference types="node" />
import { Client, Guild } from 'discord.js';
import QuickMongo from 'quick-mongo-super';
import { Emitter } from './classes/util/Emitter';
import { DatabaseManager } from './managers/DatabaseManager';
import { UtilsManager } from './managers/UtilsManager';
import { IAchievementsOptions, IAchievementsPlugins } from './types/options.interface';
import { IAchievement } from './types/achievement.interface';
import { Achievement } from './classes/Achievement';
/**
 * Main Achievements class.
 * @extends {Emitter}
 */
export declare class Achievements<IsMongoDBUsed extends boolean> extends Emitter {
    /**
     * Module version.
     * @type {string}
     */
    version: string;
    /**
     * Module configuration.
     * @type {IAchievementsOptions}
     */
    options: IAchievementsOptions<IsMongoDBUsed>;
    /**
     * Module ready state.
     * @type {boolean}
     */
    ready: boolean;
    /**
     * JSON database file checking interval.
     */
    interval?: NodeJS.Timer;
    /**
     * Discord Client.
     * @type {Client}
     */
    client: Client<boolean>;
    /**
     * Database Manager.
     * @type {IAchievementsPlugins<IsMongoDBUsed>}
     */
    plugins: IAchievementsPlugins<IsMongoDBUsed>;
    /**
     * Database Manager.
     * @type {DatabaseManager}
     */
    database: DatabaseManager;
    /**
     * Utils Manager.
     * @type {UtilsManager}
     */
    utils?: UtilsManager;
    /**
     * MongoDB Connection.
     * @type {QuickMongo}
     */
    mongo: QuickMongo;
    /**
    * Achievements managers list. Made for optimization purposes.
    * @type {Array<IManager<IsMongoDBUsed>>}
    * @private
    */
    private managers;
    /**
     * Module logger.
     * @type {Logger}
     * @private
     */
    private _logger;
    /**
     * Achievements constructor.
     * @param {Client} client Discord Client.
     * @param {IAchievementsOptions<IsMongoDBUsed>} options Module configuration.
     */
    constructor(client: Client<boolean>, options?: IAchievementsOptions<IsMongoDBUsed>);
    /**
     * Initialize the module.
     * @returns {Promise<void>}
     * @private
     */
    private init;
    /**
     * Initializes the managers.
     * @returns {void}
     * @private
     */
    private initManagers;
    /**
     * Destroys the module.
     * @returns {void}
     * @private
     */
    private kill;
    /**
    * Create a new achievement.
    * @param {string} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObject The achievement's name.
    * @returns {Promise<Achievement<T>>} The created achievement.
    */
    create<T extends object = any>(guild: string, achievementObject: Omit<IAchievement<T>, 'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'>): Promise<Achievement<T>>;
    /**
    * Create a new achievement.
    * @param {Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObject The achievement's name.
    * @returns {Promise<Achievement<T>>} The created achievement.
    */
    create<T extends object = any>(guild: Guild, achievementObject: Omit<IAchievement<T>, 'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'>): Promise<Achievement<T>>;
    /**
    * Create a new achievement.
    * @param {string} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObjects The achievement's name.
    * @returns {Promise<Array<Achievement<T>>>} The created achievements array.
    */
    createMany<T extends object = any>(guild: string, ...achievementObjects: Omit<IAchievement<T>, 'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'>[]): Promise<Achievement<T>[]>;
    /**
    * Create a new achievement.
    * @param {Guild} guild The guild to create the achievement in.
    * @param {IAchievement<T>} achievementObjects The achievement's name.
    * @returns {Promise<Array<Achievement<T>>>} The created achievements array.
    */
    createMany<T extends object = any>(guild: Guild, ...achievementObjects: Omit<IAchievement<T>, 'id' | 'guildID' | 'createdAt' | 'completions' | 'completionPercentage'>[]): Promise<Achievement<T>[]>;
    /**
     * Get all achievements for the specified guild.
     * @param {string} guild The guild to get achievements from.
     * @returns {Promise<Array<Achievement<T>>>} The achievements array.
     */
    all<T extends object = any>(guild: string): Promise<Achievement<T>[]>;
    /**
     * Get all achievements for the specified guild.
     * @param {Guild} guild The guild to get achievements from.
     * @returns {Promise<Array<Achievement<T>>>} The achievements array.
     */
    all<T extends object = any>(guild: Guild): Promise<Achievement<T>[]>;
    /**
     * Get an achievement by its ID.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to get the achievement from.
     * @returns {Promise<Achievement<T>>} The achievement object.
     */
    get<T extends object = any>(id: number, guild: string): Promise<Achievement<T>>;
    /**
     * Get an achievement by its ID.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to get the achievement from.
     * @returns {Promise<Achievement<T>>} The achievement object.
     */
    get<T extends object = any>(id: number, guild: Guild): Promise<Achievement<T>>;
    /**
     * Get an achievement index by its ID.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to get the achievement from.
     * @returns {Promise<number>} The achievement object.
     */
    getIndex(id: number, guild: string): Promise<number>;
    /**
     * Get an achievement index by its ID.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to get the achievement from.
     * @returns {Promise<number>} The achievement object.
     */
    getIndex(id: number, guild: Guild): Promise<number>;
    /**
     * Delete the achievement.
     * @param {number} id The achievement ID.
     * @param {string} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    delete<T extends object = any>(id: number, guild: string): Promise<Achievement<T>>;
    /**
     * Delete the achievement.
     * @param {number} id The achievement ID.
     * @param {Guild} guild The guild to delete the achievement from.
     * @returns {Promise<Achievement<T>>} Deleted achievement object.
     */
    delete<T extends object = any>(id: number, guild: Guild): Promise<Achievement<T>>;
}
export interface IManager<IsMongoDBUsed extends boolean> {
    name: string;
    manager: new (achievements: Achievements<IsMongoDBUsed>, options?: IAchievementsOptions<IsMongoDBUsed>) => any;
}
/**
* Emits when the module is ready.
* @event Achievements#ready
* @param {Achievements} achievements Achievements instance that was initialized and could be used.
*/
/**
* Emits when the module is destroyed.
* @event Achievements#destroy
*/
/**
 * Emits when the progress has been made on an achievement.
 * @event Achievements#achievementProgress
 * @param {IProgression<true>} progressionData Progression data object.
 */
/**
 * Emits when the progress has been made on an achievement.
 * @event Achievements#achievementComplete
 * @param {ICompletion} completionData Completion data object.
 */
