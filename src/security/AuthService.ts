import {LoginModel, User} from "./Models";
import _http from "container/http";
import _securityService from "container/security";
import _config from 'container/config';
import {AppConfig, Configurable} from "config";

/**
 * Used to configure authentication module.
 * Use auth key in configuration
 */
export interface AuthConfig extends AppConfig {
    LoginUrl?: string,
    UserIdFieldName?: string,
    PasswordFieldName?: string
}

export interface AuthService extends Configurable<AuthConfig> {
    logout()
    login(loginData: LoginModel): Promise<void>
}

export function GetDefaultAuthService() {
    return {

        _authConfig: _config.get<AuthConfig>('auth', {
            LoginUrl: 'auth/login',
            UserIdFieldName: 'email',
            PasswordFieldName: 'password'
        }),

        getConfig(): AuthConfig {
            return this._authConfig;
        },

        async login(loginData: LoginModel) {
            const {userId, password} = loginData;
            let loggedInUser = await _http.post(this._authConfig.LoginUrl, {
                [this._authConfig.UserIdFieldName]: userId,
                [this._authConfig.PasswordFieldName]: password
            })
            _securityService.setUser(loggedInUser)
        },

        logout() {
            _securityService.setUser(null);
            window.location.href = _securityService.getConfig().AuthPageUrl;
        }
    } as AuthService
}