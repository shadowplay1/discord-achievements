export declare type If<T extends boolean, IfTrue, IfFalse = null> = T extends true ? IfTrue : IfFalse;
