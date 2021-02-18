import {LoginModel, User} from "./Models";
import _http from "container/http";
import _securityService from "container/security";


export interface AuthService {
    logout()
    login(loginData: LoginModel): Promise<void>
}

export const DefaultAuthService = {
    async login(loginData: LoginModel) {
        const {email, password} = loginData;
        let loggedInUser = await _http.post('auth/login', {
            email,
            password
        })
        _securityService.setUser(loggedInUser)
    },

    logout() {
        _securityService.setUser(null);
        window.location.href = '/auth';
    }
} as AuthService