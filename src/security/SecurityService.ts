import {User} from "./Models";
import {AppConfig, Configurable} from "config";
import {Initilizable} from "common";
import _config from "container/config";

export interface SecurityService extends Configurable<SecurityConfig> {
    setUser(user: User, goHome?);
    isUserAuthenticated(): boolean;
    getCurrentUser(): User;
    getRoleRootUrl(role: string): string;
    gotoUserHome(user?: User);
    gotoRoleHome(roles: string[]);
    getSecureBundles(): string[];
    getCurrentPageBundle(): string;
    getCurrentUserRole(): string;
    init(isSecure?: boolean): void;
}

export type DefaultSecurityServiceType = SecurityService & Initilizable

export interface SecurityConfig extends AppConfig {
    ROLE_BUNDLES?: { [key: string]: string }
    ROLES?: { [key: string]: string }
    BUNDLE_ROLES?: { [key: string]: string; }
    AuthPageUrl?: string,
    LogoutUrl?: string
}

export const DefaultSecurityService = {

    _securityConfig: _config.get<SecurityConfig>('security', {
        BUNDLE_ROLES: {},
        ROLE_BUNDLES: {},
        ROLES: {},
        AuthPageUrl: '/auth',
        LogoutUrl: '/logout'
    }),
    getConfig(): SecurityConfig {
        return this._securityConfig;
    },

    userStore: null as User,
    getCurrentPageBundle(): string {
        return window.location.pathname.replace('/', '').replace('.html', '');
    },

    getCurrentUser(): User {
        return this.userStore;
    },

    getCurrentUserRole(): string {
        return this._securityConfig.BUNDLE_ROLES[this.getCurrentPageBundle()];
    },

    getRoleRootUrl(role: string): string {
        return this._securityConfig.ROLE_BUNDLES[role];
    },

    getSecureBundles(): string[] {
        return Object.keys(this._securityConfig.ROLES).map(r => this._securityConfig.ROLE_BUNDLES[r]);
    },

    gotoRoleHome(roles: string[]) {
        window.location.href = '/' + (this.getRoleRootUrl(roles.find(_ => true)) || 'error');
    },

    gotoUserHome(user: User = null) {
        if (user == null)
            user = this.getCurrentUser();

        this.gotoRoleHome(user.roles);
    },

    isUserAuthenticated(): boolean {
        return this.userStore != null;
    },

    setUser(user: User, goHome = true) {
        this.userStore = user;
        localStorage.setItem('user', user == null ? null : JSON.stringify(user))
        if (user != null && goHome)
            this.gotoUserHome(user);
    },

    init(isSecure = true) {
        const userJson = localStorage.getItem('user');
        const usr = JSON.parse(userJson);
        if (userJson != null)
            this.userStore = usr;
        const hasUserLoggedIn = this.isUserAuthenticated();

        if (isSecure && !hasUserLoggedIn) {
            window.location.href = this._securityConfig.AuthPageUrl;
            return null;
        }
        if (!isSecure && hasUserLoggedIn) {
            this.gotoUserHome(usr);
            return null;
        }
        if (isSecure && hasUserLoggedIn) {
            // check if role is denied
            const bundle = this.getCurrentPageBundle();
            const secureBundles = this.getSecureBundles();
            if (secureBundles.indexOf(bundle) > -1 && usr.roles.find(r => bundle === this._securityConfig.ROLE_BUNDLES[r]) == null) {
                this.gotoUserHome(usr);
                return null;
            }
        }
    }
} as DefaultSecurityServiceType;