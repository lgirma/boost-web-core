export interface LoginModel {
    userId: string,
    password: string
}

export interface User {
    token: string
    roles: string[],
    fullname: string,
    name: string,
    primaryRole: string
}