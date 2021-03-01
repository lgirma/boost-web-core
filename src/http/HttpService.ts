import {AppConfig, Configurable} from "config";
import _config from "container/config";
import _busyBar from 'container/busybar';
import _securityService from 'container/security';


export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';

/**
 * Used to configure http module.
 * Use http key in configuration
 */
export interface HttpConfig extends AppConfig {
    ApiUrl?: string
    WebUrl?: string
    MaxUploadFileSize?: number
}

export interface HttpService extends Configurable<HttpConfig> {
    request(method: HttpMethod, url: string, body?, config?: RequestInit): Promise<any>;
    get(url, config?: RequestInit): Promise<any>;
    post(url, body, config?: RequestInit): Promise<any>;
}

export function GetFetchHttpService() {
    return {
        _httpConfig: _config.get<HttpConfig>('http', {
            ApiUrl: '',
            WebUrl: '',
            MaxUploadFileSize: 1024*1024*10
        }),
        getConfig(): HttpConfig {
            return this._httpConfig;
        },
        async get(url, config?: RequestInit): Promise<any> {
            return await this.request('get', url, null, config);
        },
        async post(url, body, config?: RequestInit): Promise<any> {
            return await this.request('post', url, body, config);
        },
        async request(method: HttpMethod, url: string, body?, config?: RequestInit): Promise<any> {
            config = config || {};
            config.method = method || 'get';
            config.headers = config.headers || {};
            config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
            if (body != null)
                config.body = body;
            let user = _securityService && _securityService.getCurrentUser();
            if (user) {
                config.headers['Authorization'] = `Bearer ${user.token}`
            }

            try {
                _busyBar.start();
                const response = await fetch(`${this._httpConfig.ApiUrl}/${url}`, config);
                _busyBar.stop();
                if (!response.ok) {
                    let authHeader = response.headers.get('WWW-Authenticate')
                    if (authHeader && authHeader.indexOf('Bearer error="invalid_token"') > -1) {
                        if (_securityService)
                            window.location.href = _securityService.getConfig().LogoutUrl;
                        else window.location.href = '/logout'
                    }
                    throw response;
                }
                return await response.json();
            } catch (err) {
                _busyBar.stop();
                throw err;
            }
        }

    } as HttpService
}