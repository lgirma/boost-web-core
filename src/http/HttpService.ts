import {AppConfig, Configurable} from "config";

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';

export interface HttpConfig extends AppConfig {
    ApiUrl: string
    WebUrl: string
    MaxUploadFileSize: number
}

export interface HttpService extends Configurable<HttpConfig> {
    request(method: HttpMethod, url: string, body?, config?): Promise<any>;
    get(url, config?): Promise<any>;
    post(url, body, config?): Promise<any>;
}