import { DatabaseType, IAchievementsOptions } from '../types/options.interface'


export const defaultModuleConfig: IAchievementsOptions<false> = {
    databaseType: DatabaseType.JSON,

    json: {
        path: './achievements.json',
        checkingInterval: 5000
    },

    dateLocale: 'en',

    plugins: {
        economy: null as any,
        leveling: null as any
    },

    optionsChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    },

    debug: false
}
