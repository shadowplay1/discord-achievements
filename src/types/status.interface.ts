import { AssignPartialProperty } from './misc/AssignPartialProperty'

export interface IBaseState {
    status: boolean
    type: StatusCode
    message: string
}

export type IState<
    K extends string | number | symbol,
    V = any
> = AssignPartialProperty<IBaseState, K, V>

export enum StatusCode {
    OK = 0,
    ERROR = 1
}
