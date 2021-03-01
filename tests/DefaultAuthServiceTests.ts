import { describe } from 'mocha';
import { expect } from 'chai';
import * as mockery from 'mockery';
import {GetDefaultConfigService, configFor} from "../src/config";
import {HttpConfig} from "../src/http";
import {AuthConfig, User} from "../src/security";

let currentUser = null;
mockery.enable();

mockery.registerMock('container/config', GetDefaultConfigService({
    auth: configFor<AuthConfig>({
        LoginUrl: 'a/l',
        PasswordFieldName: 'secret'
    })
}));
mockery.registerMock('container/security', {
    getCurrentUser() { return currentUser; },
    setUser(u) {currentUser = u;},
    getConfig() {return {};}
});
mockery.registerMock('container/busybar', {
    start() {},
    stop() {}
});
mockery.registerMock('container/http', {
    post(url, body) {
        return configFor<User>({
            fullname: 'u', name: 'u', primaryRole: '',
            roles: [], token: '', url, body
        } as User)
    }
});
import {GetDefaultAuthService} from "../src/security";

mockery.disable();

describe('Default auth service tests', () => {

    const _auth = GetDefaultAuthService();

    it('Uses login url and field names from config', async () => {
        await _auth.login({userId: 'a', password: 'b'});
        expect(currentUser.url).to.equal('a/l');
        expect(currentUser.body.email).to.equal('a');
        expect(currentUser.body.secret).to.equal('b');
        expect(currentUser.name).to.equal('u');
    });

    it('Logs out properly', async () => {
        _auth.logout();
        expect(currentUser).to.equal(null);
    });

});