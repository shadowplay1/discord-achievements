import { DatabaseProperties } from 'quick-mongo-super/typings/interfaces/QuickMongo';
import { Achievements } from '../Achievements';
import { IAchievementsOptions } from '../types/options.interface';
/**
 * Database manager class.
 */
export declare class DatabaseManager {
    options: IAchievementsOptions<any>;
    private mongo;
    /**
     * Database manager.
     * @param {Achievements} achievements Achievements instance.
     */
    constructor(achievements: Achievements<any>);
    /**
     * Gets a list of keys in database.
     * @param {string} key The key in database.
     * @returns {Promise<string[]>} An array with all keys in database or 'null' if nothing found.
     */
    keys(key: string): Promise<string[]>;
    /**
     * Gets all the data in database
     * @returns {Promise<DatabaseProperties<P>>} Database object.
     */
    all<P = any>(): Promise<DatabaseProperties<P>>;
    /**
     * Clears the database.
     * @returns {Promise<boolean>}
     */
    clear(): Promise<boolean>;
    /**
     * Sets the specified data in the database.
     * @param {string} key The key in database.
     * @param {string} value Value to set.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    set<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>>;
    /**
     * Fetches the data from database.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Fetched data object for a specified key.
     */
    fetch<T = any>(key: string): Promise<T>;
    /**
    * Checks if the element is existing in database.
    * @param {string} key The key in database.
    * @returns {Promise<boolean>} True if the element is existing in database, false otherwise.
    */
    has(key: string): Promise<boolean>;
    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for {@link DatabaseManager.has()} method.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} True if the element is existing in database, false otherwise.
     */
    includes(key: string): Promise<boolean>;
    /**
     * Deletes the specified key from database.
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    delete<P = any>(key: string): Promise<DatabaseProperties<P>>;
    /**
     * Fetches the data from database.
     *
     * This method is an alias for {@link DatabaseManager.fetch()} method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Fetched data object for a specified key.
     */
    get<T = any>(key: string): Promise<T>;
    /**
     * Deletes the specified key from database.
     *
     * This method is an alias for {@link DatabaseManager.delete()} method.
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    remove<P = any>(key: string): Promise<DatabaseProperties<P>>;
    /**
     * Adds a number to a property data in database.
     *
     * [!] Target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    add<P = any>(key: string, value: number): Promise<DatabaseProperties<P>>;
    /**
     * Subtracts a number from a property data in database.
     *
     * [!] Target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    subtract<P = any>(key: string, value: number): Promise<DatabaseProperties<P>>;
    /**
     * Pushes a value into an array in database.
     *
     * [!] Target must be an array.
     * @param {string} key The key in database.
     * @param {any} value Any value to push.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    push<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>>;
    /**
     * Pops a value from an array in database.
     *
     * [!] Target must be an array.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    pop<P = any>(key: string, index: number): Promise<DatabaseProperties<P>>;
    /**
    * Changes the specified element's value in a specified array in the database.
    *
    * [!] Target must be an array.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
    */
    pull<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>>;
}
