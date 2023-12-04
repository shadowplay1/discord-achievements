export type RestOrArray<T> = T[] | [T[]]

/**
 * @typedef {Array<T>} RestOrArray<T>
 * Represents a type that works as an array of specified type or ...spread of specified type.
 *
 * Type parameters:
 * - T (any): The type to convert into rest-or-array type.
 */
