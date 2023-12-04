import { AssignPartialProperty } from './misc/AssignPartialProperty.type';
export interface IBaseState {
    status: boolean;
    type: StatusCode;
    message: string;
}
export declare type TypeState<K extends string | number | symbol, V = any> = AssignPartialProperty<IBaseState, K, V>;
export declare enum StatusCode {
    OK = 0,
    ERROR = 1
}
/**
 * @typedef {object} IBaseState Base operation status object.
 * @prop {boolean} status Status of the state.
 * @prop {boolean} type Type of the state.
 * @prop {boolean} message Result message.
 */
/**
 * @typedef {object} TypeState Operation status object.
 *
 * Type parameters:
 *
 * - K (string): Property name that will be set on success.
 * - V (any): Any value to set.
 *
 * @prop {boolean} status Status of the state.
 * @prop {boolean} type Type of the state.
 * @prop {boolean} message Result message.
 * @prop {Achievement} achievement Achievement object.
 */
/**
 * @typedef {object} StatusCode Operation status codes.
 * @prop {number} OK Whether the operation was completed successfully.
 * @prop {number} ERROR Whether the operation failed.
 */
