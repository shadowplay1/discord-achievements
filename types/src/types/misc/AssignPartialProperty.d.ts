export declare type AssignPartialProperty<T, K extends string | number | symbol, V> = T & Partial<Record<K, V>>;
