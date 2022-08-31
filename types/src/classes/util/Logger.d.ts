import { ILoggerColors } from '../../types/colors.interface';
/**
* Achievements logger.
* @private
*/
export declare class Logger {
    options?: {
        debug?: boolean;
    };
    colors: ILoggerColors;
    /**
     * Logger constructor.
     * @param {LoggerOptions} options Logger configuration.
    */
    constructor(options?: {
        debug?: boolean;
    });
    /**
     * Sends an info message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     */
    info(message: string, color?: keyof ILoggerColors): void;
    /**
     * Sends an warning message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='lightyellow'] Message color to use.
     */
    warn(message: string, color?: keyof ILoggerColors): void;
    /**
     * Sends an error message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     */
    error(message: string, color?: keyof ILoggerColors): void;
    /**
     * Sends a debug message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='yellow'] Message color to use.
     */
    debug(message: string, color?: keyof ILoggerColors): void;
}
