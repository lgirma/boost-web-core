import {AppConfig, Configurable} from "config";


export interface HttpConfig extends AppConfig {
    ApiUrl: string
    WebUrl: string
    MaxFileSize: number
}

export interface HttpService extends Configurable<HttpConfig> {
    request(method: 'get' | 'post' | 'put' | 'delete' | 'options', url: string, body?, config?): Promise<any>;
    get(url, config?): Promise<any>;
    post(url, body, config?): Promise<any>;
}