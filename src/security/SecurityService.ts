import {AppSecurityConfig, User} from "./Models";
import {Configurable} from "config";
import {Initilizable} from "common";
import _config from "container/config";

export interface SecurityService {
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

export type DefaultSecurityServiceType = SecurityService & Configurable<AppSecurityConfig> & Initilizable

export const DefaultSecurityService = {

    userStore: null as User,

    defaultConfig() {
        return {
            security: {
                BUNDLE_ROLES: {},
                ROLE_BUNDLES: {},
                ROLES: {}
            }
        };
    },
    getCurrentPageBundle(): string {
        return window.location.pathname.replace('/', '').replace('.html', '');
    },

    getCurrentUser(): User {
        return this.userStore;
    },

    getCurrentUserRole(): string {
        return _config.get<AppSecurityConfig>('security').BUNDLE_ROLES[this.getCurrentPageBundle()];
    },

    getRoleRootUrl(role: string): string {
        return _config.get<AppSecurityConfig>('security').ROLE_BUNDLES[role];
    },

    getSecureBundles(): string[] {
        return Object.keys(_config.get<AppSecurityConfig>('security').ROLES).map(r => _config.get<AppSecurityConfig>('security').ROLE_BUNDLES[r]);
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
            window.location.href = '/auth';
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
            if (secureBundles.indexOf(bundle) > -1 && usr.roles.find(r => bundle === _config.get<AppSecurityConfig>('security').ROLE_BUNDLES[r]) == null) {
                this.gotoUserHome(usr);
                return null;
            }
        }
    }
} as DefaultSecurityServiceType;