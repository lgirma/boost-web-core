import { describe } from 'mocha';
import { expect } from 'chai';

import {GetDefaultConfigService} from "../src/config";

type MySectionConfigType = { name?: string, version?: number }

describe('Default config service tests', () => {

    const _configService = GetDefaultConfigService({
        mySection: {
            version: 1
        }
    });

    it('Returns config section with default value', () => {
        _configService.get('mySection', {
            name: 'My Name'
        });
        const section = _configService.get<MySectionConfigType>('mySection');
        expect(section).to.not.null;
        expect(section.name).to.equal('My Name');
    });

    it('Merges configs properly', () => {
        _configService.get('mySection', {
            name: 'My Name'
        });
        _configService.get('myOtherSection', {
            dir: '/home'
        });
        const section = _configService.get<MySectionConfigType>('mySection');
        expect(section).to.not.null;
        expect(section.version).to.equal(1);
    });

    it('Prefers global application config over module default config', () => {
        _configService.get('mySection', {
            version: 2
        });
        const section = _configService.get<MySectionConfigType>('mySection');
        expect(section).to.not.null;
        expect(section.version).to.equal(1);
    });

});