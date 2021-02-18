export interface HttpService {
    request(method: 'get' | 'post' | 'put' | 'delete' | 'options', url: string, body?, config?): Promise<any>;
    get(url, config?): Promise<any>;
    post(url, body, config?): Promise<any>;
}