import { Achievements } from '../Achievements'
import { ICompletionEvent, IProgression } from './achievement.interface'

export interface IAchievementsEvents {
    ready: Achievements<any>
    destroy: void
    achievementComplete: ICompletionEvent
    achievementProgress: IProgression<true>
}

export enum AchievementsEvents {
    READY = 'ready',
    DESTROY = 'destroy',
    ACHIEVEMENT_COMPLETE = 'achievementComplete',
    ACHIEVEMENT_PROGRESS = 'achievementProgress'
}
