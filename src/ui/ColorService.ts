import {LightingType, MaterialType, MessageType, Temperature, Themeable} from "./Common";


export interface ThemeService {
    init(themeParams?: Themeable);
    set(themeParams: Themeable);
    get(): Themeable;
}

const defaultTheme: Themeable = {
    lighting: LightingType.LIGHT,
    material: MaterialType.REGULAR,
    message: MessageType.NONE,
    scale: 1,
    temperature: Temperature.COLD
}

export function GetDefaultThemeService(initWith?: Themeable): ThemeService {
    return {
        _currentTheme: {...defaultTheme, ...initWith},
        init(themeParams?: Themeable) {
            this._currentTheme = {...defaultTheme, ...themeParams};
        },
        get(): Themeable {
            return this._currentTheme
        },
        set(themeParams: Themeable) {
            this._currentTheme = {...this._currentTheme, ...themeParams}
        }
    } as ThemeService
}