import { IAchievementsEvents } from '../../types/events.interface';
/**
 * Achievements event emitter.
 */
export declare class Emitter {
    /**
     * Listens to the event.
     * @param {string} event Event name.
     * @param {Function} listener Callback function.
     */
    on<T extends keyof IAchievementsEvents>(event: T, listener: (...args: IAchievementsEvents[T][]) => any): Emitter;
    /**
     * Listens to the event only once.
     * @param {string} event Event name.
     * @param {Function} listener Callback function.
     */
    once<T extends keyof IAchievementsEvents>(event: T, listener: (...args: IAchievementsEvents[T][]) => any): Emitter;
    /**
     * Emits the event.
     * @param {string} event Event name.
     * @param {any[]} args Parameters to pass in the event.
     */
    emit<T extends keyof IAchievementsEvents>(event: T, ...args: IAchievementsEvents[T][]): boolean;
}
