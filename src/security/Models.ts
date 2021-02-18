import {AppConfig} from "config/AppConfig";

export interface LoginModel {
    email: string,
    password: string
}

export interface User {
    token: string
    roles: string[],
    fullname: string,
    name: string,
    primaryRole: string
}

export interface AppSecurityConfig extends AppConfig {
    ROLE_BUNDLES: {
        [key: string]: string
    }

    ROLES: {
        [key: string]: string
    }

    BUNDLE_ROLES: {
        [key: string]: string;
    }
}