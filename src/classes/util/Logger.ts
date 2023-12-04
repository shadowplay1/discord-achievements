import { ILoggerColors } from '../../types/colors.interface'


/**
 * Achievements logger class.
 * @private
 */
export class Logger {
    public options?: ILoggerOptions
    public colors: ILoggerColors

    /**
     * Logger constructor.
     * @param {ILoggerOptions} options Logger configuration.
    */
    constructor(options?: ILoggerOptions) {

        /**
         * Logger configuration.
         * @type {LoggerOptions}
         */
        this.options = options

        /**
         * Logger colors object.
         * @type {LoggerColors}
         */
        this.colors = {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            lightgray: '\x1b[37m',
            default: '\x1b[39m',
            darkgray: '\x1b[90m',
            lightred: '\x1b[91m',
            lightgreen: '\x1b[92m',
            lightyellow: '\x1b[93m',
            lightblue: '\x1b[94m',
            lightmagenta: '\x1b[95m',
            lightcyan: '\x1b[96m',
            white: '\x1b[97m',
            reset: '\x1b[0m',
        }
    }

    /**
     * Sends an info message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     */
    public info(message: string, color: keyof ILoggerColors = 'cyan'): void {
        console.log(`${this.colors[color]}[Achievements] ${message}${this.colors.reset}`)
    }

    /**
     * Sends an warning message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='lightyellow'] Message color to use.
     */
    public warn(message: string, color: keyof ILoggerColors = 'lightyellow'): void {
        console.log(`${this.colors[color]}[⚠️  Achievements ] ${message}${this.colors.reset}`)
    }

    /**
     * Sends an error message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     */
    public error(message: string, color: keyof ILoggerColors = 'red'): void {
        console.error(`${this.colors[color]}[Achievements - Error] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a debug message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='yellow'] Message color to use.
     */
    public debug(message: string, color: keyof ILoggerColors = 'yellow'): void {
        if (!this.options?.debug) {
            return
        }

        console.log(`${this.colors[color]}[Achievements] ${message}${this.colors.reset}`)
    }
}

export interface ILoggerOptions {
    debug?: boolean
}

/**
 * @typedef {object} ILoggerOptions
 * @prop {boolean} [debug] If true, debug mode will be enabled.
 */
