export declare type AssignPartialProperty<T, K extends string | number | symbol, V> = T & Partial<Record<K, V>>;
/**
 * @typedef {object} AssignPartialProperty Assigns a new property to a type.
 *
 * Type parameters:
 *
 * - T (any): The object to assign property to.
 * - V (string, number or symbol): The value to set.
 */
