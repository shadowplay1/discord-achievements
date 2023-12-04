import { readFileSync, writeFileSync, existsSync } from 'fs'

import { Mongo, DatabaseProperties } from 'quick-mongo-super/MongoItems'

import { Achievements } from '../Achievements'
import { AchievementsError } from '../classes/AchievementsError'

import { errors } from '../structures/errors.constant'
import { ErrorCodes } from '../structures/ErrorCodes'
import { isObject } from '../structures/functions/isObject.function'

import { DatabaseType, IAchievementsOptions } from '../types/options.interface'

/**
 * Database manager class.
 */
export class DatabaseManager {
    public options: IAchievementsOptions<any>
    private mongo: Mongo<string, any>

    /**
     * Database manager.
     * @param {Achievements} achievements Achievements instance.
     */
    constructor(achievements: Achievements<any>) {

        /**
         * Module configuration.
         * @type {IAchievementsOptions}
         */
        this.options = achievements.options

        /**
         * Database connection.
         * @type {Mongo}
         * @private
         */
        this.mongo = achievements.mongo
    }

    /**
     * Gets a list of keys in database.
     * @param {string} key The key in database.
     * @returns {Promise<string[]>} An array with all keys in database or 'null' if nothing found.
     */
    public async keys(key: string): Promise<string[]> {
        const database = await this.all()
        const data = await this.fetch(key)

        if (!key || typeof key !== 'string') {
            return Object.keys(database).filter(key => database[key])
        }

        if (data == null) {
            return []
        }

        return Object.keys(data)
            .filter(key => data[key] !== undefined)
    }

    /**
     * Gets all the data in database
     * @returns {Promise<DatabaseProperties<P>>} Database object.
     */
    public async all<P = any>(): Promise<DatabaseProperties<P>> {
        const options = this.options as any

        if (this.options.databaseType == DatabaseType.JSON) {
            const path = options.json?.path as string

            if (!existsSync(path)) {
                writeFileSync(path, '{}')
            }

            const database = JSON.parse(readFileSync(path, 'utf-8'))
            return database
        }

        const database = this.mongo.all()
        return database
    }

    /**
     * Clears the database.
     * @returns {Promise<boolean>}
     */
    public async clear(): Promise<boolean> {
        const options = this.options as any

        if (this.options.databaseType == DatabaseType.JSON) {
            const path = options.json?.path as string

            if (!existsSync(path)) {
                writeFileSync(path, '{}')
                return false
            }

            const database = await this.all()

            if (!Object.keys(database).length) {
                return false
            }

            writeFileSync(path, '{}')
            return true
        }

        const result = await this.mongo.clear()
        return result
    }

    /**
     * Sets the specified data in the database.
     * @param {string} key The key in database.
     * @param {string} value Value to set.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async set<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>> {
        const options = this.options as any
        const database = await this.all()

        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.set() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (value === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"value" parameter in DatabaseManager.set() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }


        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.fetch() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (value === undefined) {
            throw new AchievementsError(
                errors.invalidType('"value" parameter in DatabaseManager.fetch() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }


        if (this.options.databaseType == DatabaseType.JSON) {
            const path = options.json?.path as string

            const keys = key.split('.')
            let fetched = database

            for (let i = 0; i < keys.length; i++) {
                if (keys.length - 1 == i) {
                    fetched[keys[i]] = value

                } else if (!isObject(fetched[keys[i]])) {
                    fetched[keys[i]] = {}
                }

                fetched = fetched?.[keys[i]]
            }

            writeFileSync(
                path || './storage.json',
                JSON.stringify(database, null, '\t')
            )

            return database
        }

        const result = await this.mongo.set<any>(key, value)
        return result
    }

    /**
     * Fetches the data from database.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Fetched data object for a specified key.
     */
    public async fetch<T = any>(key: string): Promise<T> {
        let fetched = await this.all()

        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.fetch() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.fetch() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const keys = key.split('.')
            let database = fetched

            for (let i = 0; i < keys.length; i++) {
                if (keys.length - 1 == i) {
                    fetched = database?.[keys[i]] || null
                }

                database = database?.[keys[i]]
            }

            return fetched as any || null
        }

        const result = await this.mongo.get<T>(key)
        return result
    }

    /**
    * Checks if the element is existing in database.
    * @param {string} key The key in database.
    * @returns {Promise<boolean>} True if the element is existing in database, false otherwise.
    */
    public async has(key: string): Promise<boolean> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.has() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.has() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        const fetched = await this.fetch(key)
        return !!fetched
    }

    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for {@link DatabaseManager.has()} method.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} True if the element is existing in database, false otherwise.
     */
    public includes(key: string): Promise<boolean> {
        return this.has(key)
    }

    /**
     * Deletes the specified key from database.
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async delete<P = any>(key: string): Promise<DatabaseProperties<P>> {
        const options = this.options as any
        const fetched = await this.all()

        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.delete() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.delete() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const keys = key.split('.')
            let database = fetched

            for (let i = 0; i < keys.length; i++) {
                if (keys.length - 1 == i) {
                    delete database?.[keys[i]]

                } else if (!isObject(database?.[keys[i]])) {
                    database[keys[i]] = {}
                }

                database = database[keys[i]]
            }

            writeFileSync(
                options.json?.path as string,
                JSON.stringify(fetched, null, '\t')
            )

            return fetched
        }

        const result = await this.mongo.delete<P>(key)
        return result
    }

    /**
     * Fetches the data from database.
     *
     * This method is an alias for {@link DatabaseManager.fetch()} method.
     * @param {string} key The key in database.
     * @returns {Promise<T>} Fetched data object for a specified key.
     */
    public get<T = any>(key: string): Promise<T> {
        return this.fetch<T>(key)
    }

    /**
     * Deletes the specified key from database.
     *
     * This method is an alias for {@link DatabaseManager.delete()} method.
     * @param {string} key The key in database.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public remove<P = any>(key: string): Promise<DatabaseProperties<P>> {
        return this.delete<P>(key)
    }

    /**
     * Adds a number to a property data in database.
     *
     * [!] Target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async add<P = any>(key: string, value: number): Promise<DatabaseProperties<P>> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.add() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.add() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (value === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"value" parameter in DatabaseManager.add() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof value !== 'number') {
            throw new AchievementsError(
                errors.invalidType('"value" parameter in DatabaseManager.add() method', 'number', typeof value),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const fetched = (await this.fetch<number>(key)) || 0

            if (typeof fetched !== 'number') {
                throw new AchievementsError(
                    errors.invalidTargetType('DatabaseManager.add() method', 'number', typeof fetched),
                    ErrorCodes.INVALID_TYPE
                )
            }

            const [fetchedNumber, valueToAdd] = [parseInt(fetched as any), parseInt(value as any)]
            const result = fetchedNumber + valueToAdd

            const updated = await this.set<number>(key, result)
            return updated
        }

        const updated = await this.mongo.add<P>(key, value)
        return updated
    }

    /**
     * Subtracts a number from a property data in database.
     *
     * [!] Target must be a number.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async subtract<P = any>(key: string, value: number): Promise<DatabaseProperties<P>> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.subtract() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.subtract() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (value === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"value" parameter in DatabaseManager.subtract() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof value !== 'number') {
            throw new AchievementsError(
                errors.invalidType('"value" parameter in DatabaseManager.subtract() method', 'number', typeof value),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const fetched = (await this.fetch<number>(key)) || 0

            if (typeof fetched !== 'number') {
                throw new AchievementsError(
                    errors.invalidTargetType('DatabaseManager.subtract() method', 'number', typeof fetched),
                    ErrorCodes.INVALID_TYPE
                )
            }

            const [fetchedNumber, valueToSubtract] = [parseInt(fetched as any), parseInt(value as any)]
            const result = fetchedNumber + valueToSubtract

            const updated = await this.set<number>(key, result)
            return updated
        }

        const updated = await this.mongo.subtract<P>(key, value)
        return updated
    }

    /**
     * Pushes a value into an array in database.
     *
     * [!] Target must be an array.
     * @param {string} key The key in database.
     * @param {any} value Any value to push.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async push<T = any, P = any>(key: string, value: T): Promise<DatabaseProperties<P>> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.push() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.push() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (value === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"value" parameter in DatabaseManager.push() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const fetched = (await this.fetch<T[]>(key)) || []

            if (!Array.isArray(fetched)) {
                throw new AchievementsError(
                    errors.invalidTargetType('DatabaseManager.push()', 'array', typeof fetched),
                    ErrorCodes.INVALID_TYPE
                )
            }

            fetched.push(value)

            const updated = await this.set<T[]>(key, fetched)
            return updated
        }

        const updated = await this.mongo.push<any>(key, value)
        return updated
    }

    /**
     * Pops a value from an array in database.
     *
     * [!] Target must be an array.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
     */
    public async pop<P = any>(key: string, index: number): Promise<DatabaseProperties<P>> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.pop() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.pop() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (index === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"index" parameter in DatabaseManager.pop() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof index !== 'number') {
            throw new AchievementsError(
                errors.invalidType('"index" parameter in DatabaseManager.pop() method', 'number', typeof index),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const fetched = (await this.fetch(key)) || []

            if (!Array.isArray(fetched)) {
                throw new AchievementsError(
                    errors.invalidTargetType('DatabaseManager.pop()', 'array', typeof fetched),
                    ErrorCodes.INVALID_TYPE
                )
            }

            fetched.splice(index, 1)

            const updated = await this.set(key, fetched)
            return updated
        }

        const updated = await this.mongo.pop(key, index)
        return updated
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    *
    * [!] Target must be an array.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {Promise<DatabaseProperties<P>>} Updated data object for specified key.
    */
    public async pull<T = any, P = any>(key: string, index: number, newValue: T): Promise<DatabaseProperties<P>> {
        if (!key) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"key" parameter in DatabaseManager.pull() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof key !== 'string') {
            throw new AchievementsError(
                errors.invalidType('"key" parameter in DatabaseManager.pull() method', 'string', typeof key),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (index === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"index" parameter in DatabaseManager.pull() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (typeof index !== 'number') {
            throw new AchievementsError(
                errors.invalidType('"index" parameter in DatabaseManager.pull() method', 'number', typeof index),
                ErrorCodes.INVALID_TYPE
            )
        }

        if (newValue === undefined) {
            throw new AchievementsError(
                errors.requiredParameterMissing('"newValue" parameter in DatabaseManager.pull() method'),
                ErrorCodes.REQUIRED_PARAMETER_MISSING
            )
        }

        if (this.options.databaseType == DatabaseType.JSON) {
            const fetched = (await this.fetch<T[]>(key)) || []

            if (!Array.isArray(fetched)) {
                throw new AchievementsError(
                    errors.invalidTargetType('DatabaseManager.pull()', 'array', typeof fetched),
                    ErrorCodes.INVALID_TYPE
                )
            }

            fetched.splice(index, 1, newValue)

            const updated = await this.set<T[]>(key, fetched)
            return updated
        }

        const updated = await this.mongo.pull<any>(key, index, newValue)
        return updated
    }
}
