export declare type If<T extends boolean, IfTrue, IfFalse = null> = T extends true ? IfTrue : IfFalse;
/**
 * @typedef {boolean} If Returns the specified types based on a condition.
 *
 * Type parameters:
 *
 * - T (boolean): The condition to check.
 * - IfTrue (any): Type to return if the condition returned "true".
 * - IfFalse (any): Optional type to return if the condition returned "false". Default: null.
 */
