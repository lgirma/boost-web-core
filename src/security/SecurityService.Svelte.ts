import {SecurityService} from "./SecurityService";
import { writable, get } from 'svelte/store'
import {User, AppSecurityConfig} from './Models'
import {dep, resolve} from "container";
import {ConfigService, Configurable} from "config/AppConfig";
import {Initilizable} from "common/Initilizable";

// Logged in user
const userStore = writable(null);

export type SvelteSecurityService = SecurityService & Configurable<AppSecurityConfig> & Initilizable

export function svelteSecurityService(dependencies = {appConfig: dep<ConfigService>()}) : SvelteSecurityService
{
    const {appConfig: _config} = resolve(dependencies);
    return {
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
            return get(userStore);
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
            return get(userStore) != null;
        },

        setUser(user: User, goHome = true) {
            userStore.set(user);
            localStorage.setItem('user', user == null ? null : JSON.stringify(user))
            if (user != null && goHome)
                this.gotoUserHome(user);
        },

        init(isSecure = true) {
            const userJson = localStorage.getItem('user');
            const usr = JSON.parse(userJson);
            if (userJson != null)
                userStore.set(usr);
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
    }
}