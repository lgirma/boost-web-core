import { describe } from 'mocha';
import { expect } from 'chai';
import * as mockery from 'mockery';
import {GetDefaultConfigService, configFor} from "../src/config";
import {HttpConfig} from "../src/http";

let currentUser = null;
mockery.enable();

mockery.registerMock('container/config', GetDefaultConfigService({
    http: configFor<HttpConfig>({
        ApiUrl: 'http://example.com'
    })
}));
mockery.registerMock('container/security', {
    getCurrentUser() { return currentUser; }
});
mockery.registerMock('container/busybar', {
    start() {},
    stop() {}
});
import {GetFetchHttpService} from "../src/http";

mockery.disable();

describe('Default http service tests', () => {

    const _http = GetFetchHttpService();

    it('Uses api url from config', async () => {
        let response = await _http.get('sample-get-request');
        expect(response.requestInfo).to.equal('http://example.com/sample-get-request')
    })

    it('Calls get requests appropriately', async () => {
        let response = await _http.get('sample-get-request');
        expect(response.init.method).to.equal('get')
    });

    it('Throws when server result is not 2xx OK', async () => {
        let error = null;
        try { await _http.get('notOk'); }
        catch (err) { error = err; }
        expect(error).to.not.be.null;
    });

    it('Calls post requests appropriately', async () => {
        let response = await _http.post('sample-post-request', {
            data: 1
        });
        expect(response.init.method).to.equal('post');
        expect(response.init.body).to.not.equal(null);
        expect(response.init.body.data).to.equal(1);
    });

    it('Puts jwt bearer token in header', async () => {
        currentUser = {token: 'abc'}
        let response = await _http.get('sample-get-request');
        expect(response.init.headers.Authorization).to.equal('Bearer abc');
    });

});