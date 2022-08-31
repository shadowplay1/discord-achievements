export { Achievements, IManager } from './Achievements'

export { Achievement, CompletionPercentageUpdateType } from './classes/Achievement'
export { AchievementsError } from './classes/AchievementsError'

export { Emitter } from './classes/util/Emitter'
export { Logger } from './classes/util/Logger'

export { Completions } from './classes/Completions.achievement'
export { Progresses } from './classes/Progresses.achievement'

export { DatabaseManager } from './managers/DatabaseManager'
export { UtilsManager } from './managers/UtilsManager'

export { isObject } from './structures/functions/isObject.function'

export { defaultModuleConfig } from './structures/defaultModuleConfig.constant'
export { errors } from './structures/errors.constant'

export { ErrorCodes } from './structures/ErrorCodes'

export { If } from './types/misc/If'
export { AssignPartialProperty } from './types/misc/AssignPartialProperty'

export { CustomAchievementData } from './types/CustomAchievementData'
export { ILoggerColors } from './types/colors.interface'

export {
    IAchievement, AchievementType,
    IAchievementRequirements, IBaseProgression,
    ICompletion, ICompletionEvent,
    IProgression
} from './types/achievement.interface'

export { IAchievementsEvents, AchievementsEvents } from './types/events.interface'

export {
    DatabaseType, IAchievementsOptions,
    IAchievementsPlugins, IBaseAchievementsOptions,
    ICheckerOptions, IJSONDatabaseOptions
} from './types/options.interface'

export {
    IBaseState, IState,
    StatusCode
} from './types/status.interface'
