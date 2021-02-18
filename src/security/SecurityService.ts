import {User} from "./Models";

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