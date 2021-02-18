import {LoginModel, User} from "./Models";
import {dep, resolve} from "container";
import {SecurityService} from "./SecurityService";
import {HttpService} from "http/HttpService";

export interface AuthService {
    logout()
    login(loginData: LoginModel): Promise<void>
}

export function defaultAuthService(dependencies = {
    securityService: dep<SecurityService>(), http: dep<HttpService>()
}) : AuthService {
    const {securityService: _securityService, http: _http} = resolve(dependencies);
    return {
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
    }
}