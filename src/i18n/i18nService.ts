import {AppConfig} from "config";
import _config from 'container/config';

export type i18nTranslations = {[key: string]: string}
export type i18nResource = {[langKey: string]: i18nTranslations};

export interface i18nService {
    getCurrentUserLanguage(): string;
    changeLanguage(lang: string);
    _(key: string): string
}

export interface WebLocale {
    displayName: string
    shortName: string
    key: string
}

/**
 * Configuration for i18n module
 * Use i18n key in configuration
 */
export interface i18nConfig extends AppConfig {
    /**
     * Default value is 'en'
     */
    DefaultLocale?: string
    /**
     * Locales your app supports
     * Default is `[ {displayName: 'English', key: 'en', shortName: 'En'} ]`
     */
    Locales?: WebLocale[],
    Translations?: i18nResource
}

export const GetDefaultI18nService = (): i18nService => ({

    _dictionary: {},
    _currentLang: null as string,

    _18nConfig: _config.get<i18nConfig>('i18n', {
        DefaultLocale: 'en',
        Locales: [
            {displayName: 'English', key: 'en', shortName: 'En'}
        ],
        Translations: {}
    }),

    _(key: string): string {
        const currLang = this._currentLang ?? this.getCurrentUserLanguage();
        let result = this._18nConfig.Translations[currLang][key];
        if (result === undefined && currLang != this._18nConfig.DefaultLocale)
            result = this._18nConfig.Translations[this._18nConfig.DefaultLocale][key];
        return result ?? key;
    },

    changeLanguage(lang: string) {
        localStorage.setItem('userLanguage', lang);
        this._currentLang = lang;
    },

    getCurrentUserLanguage(): string {
        return this._currentLang
            ?? (this._currentLang = localStorage.getItem('userLanguage') || this._18nConfig.DefaultLocale || 'en');
    }

} as i18nService)