import {AppConfig} from "config";

export type i18nResource = {[langKey: string]: any};

export interface i18nService {
    init(i18nResources: i18nResource, defaultLocale?: string);
    getCurrentUserLanguage(): string;
    changeLanguage(lang: string);
    _(key: string): string
}

export interface WebLocale {
    displayName: string
    shortName: string
    key: string
}

export interface i18nConfig extends AppConfig {
    DefaultLocale: string
    Locales: WebLocale[]
}