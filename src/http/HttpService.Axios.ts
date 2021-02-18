import axios from 'axios';
import {HttpService} from "./HttpService";
import {BusyBarService} from 'ui/BusyBarService';
import {dep, resolve} from "container";
import {HttpConfig} from "./HttpConfig";
import {SecurityService} from "security/SecurityService";
import {ConfigService, Configurable} from "config/AppConfig";


function getRequestFactory(securityService: SecurityService, appConfig: ConfigService) {
    let user = securityService.getCurrentUser()

    return axios.create({
        baseURL: `${appConfig.get<HttpConfig>('http').ApiUrl}/api`,
        timeout: 100000,
        headers: {
            ...(user ? {'Authorization': `Bearer ${user.token}`} : {})
        }
    });
}

export type AxiosHttpService = HttpService & Configurable<HttpConfig>

export function axiosHttpService(dependencies = {
    busyBar: dep<BusyBarService>(), appConfig: dep<ConfigService>(), securityService: dep<SecurityService>()
}) : AxiosHttpService {
    const {busyBar, securityService, appConfig} = resolve(dependencies);

    return {
        defaultConfig() {
            return {
                http: {
                    ApiUrl: '',
                    WebUrl: '',
                    MaxFileSize: 1024 * 1024 * 10
                }
            };
        },

        async request(method, url, body = null, config = null) {

            try {
                busyBar.start();
                const axios_base = getRequestFactory(securityService, appConfig);
                let result = await (axios_base as any)[method](url, body, config);
                let json_data = await result.data;
                busyBar.stop();
                return json_data;
            } catch (error) {
                busyBar.stop();
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    throw error.response.data;
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    throw error.request;
                } else {
                    // Something happened in setting up the request that triggered an Error
                    throw error.message;
                }
            }
        },

        async get(url, config = null) {
            return await this.request('get', url, null, config);
        },

        async post(url, body, config = null) {
            return await this.request('post', url, body, config);
        }
    }
}