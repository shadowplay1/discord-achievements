import { EventEmitter } from 'events'
import { IAchievementsEvents } from '../../types/events.interface'

const emitter = new EventEmitter({
    captureRejections: true
})


/**
 * Achievements event emitter.
 */
export class Emitter {

    /**
     * Listens to the event.
     * @param {string} event Event name.
     * @param {Function} listener Callback function.
     */
    on<T extends keyof IAchievementsEvents>(event: T, listener: (...args: IAchievementsEvents[T][]) => any): Emitter {
        emitter.on(event as T, listener)
        return this
    }

    /**
     * Listens to the event only once.
     * @param {string} event Event name.
     * @param {Function} listener Callback function.
     */
    once<T extends keyof IAchievementsEvents>(event: T, listener: (...args: IAchievementsEvents[T][]) => any): Emitter {
        emitter.once(event as T, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {string} event Event name.
     * @param {any[]} args Parameters to pass in the event.
     */
    emit<T extends keyof IAchievementsEvents>(event: T, ...args: IAchievementsEvents[T][]): boolean {
        return emitter.emit(event as T, ...args)
    }
}
