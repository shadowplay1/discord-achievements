import { Achievements } from '../Achievements'
import { ICompletionEvent, IProgression } from './achievement.interface'

export interface IAchievementsEvents {
    ready: [achievements: Achievements<any>]
    destroy: [voidPAram: void]
    achievementComplete: [achievementCompletionEvent: ICompletionEvent]
    achievementProgress: [achievementProgresssionEvent: IProgression<true>]
}

export enum AchievementsEvents {
    READY = 'ready',
    DESTROY = 'destroy',
    ACHIEVEMENT_COMPLETE = 'achievementComplete',
    ACHIEVEMENT_PROGRESS = 'achievementProgress'
}
