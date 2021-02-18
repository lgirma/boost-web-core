import {LoginModel, User} from "./Models";
import _http from "container/http";
import _securityService from "container/security";
import _config from 'container/config';
import {AppConfig, Configurable} from "config";

export interface AuthConfig extends AppConfig {
    LoginUrl: string
}

export interface AuthService extends Configurable<AuthConfig> {
    logout()
    login(loginData: LoginModel): Promise<void>
}

export const DefaultAuthService = {

    _authConfig: _config.get<AuthConfig>('auth', {
        LoginUrl: 'auth/login'
    }),

    getConfig(): AuthConfig {
        return this._authConfig;
    },

    async login(loginData: LoginModel) {
        const {email, password} = loginData;
        let loggedInUser = await _http.post(this._authConfig.LoginUrl, {
            email,
            password
        })
        _securityService.setUser(loggedInUser)
    },

    logout() {
        _securityService.setUser(null);
        window.location.href = _securityService.getConfig().AuthPageUrl;
    }
} as AuthService