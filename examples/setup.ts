import {DependencySetup} from "container";
import {defaultAuthService} from "security/AuthService";
import {svelteSecurityService} from "security/SecurityService.Svelte";
import {axiosHttpService} from "http/HttpService.Axios";
import {topBarService} from "ui/BusyBarService.Topbar";
import {SvelteApp} from "application/AppService.Svelte";
import {DefaultConfigService} from "../src";

export const setup : DependencySetup = () => ({
    securityService: svelteSecurityService,
    auth: defaultAuthService,
    http: axiosHttpService,
    busyBar: topBarService,
    appService: SvelteApp,
    appConfig: new DefaultConfigService(),
});