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