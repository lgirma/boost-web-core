import { describe } from 'mocha';
import { expect } from 'chai';
import * as mockery from 'mockery';
import {GetDefaultConfigService} from "../src/config";
import './common';


mockery.enable();
mockery.registerMock('container/config', GetDefaultConfigService({
    i18n: {
        Translations: {
            en: {CANCEL: 'Cancel', PARAMETERIZED: 'Accept {0} and {1}'},
            am: {CANCEL: 'ተወው', OK: 'እሺ', PARAMETERIZED: '{0} እና {1} ተቀበል'}
        },
        DefaultLocale: 'am'
    }
}));
import {GetDefaultI18nService} from "../src/i18n";
mockery.disable();

describe('Default i18n service tests', () => {

    const _i18nService = GetDefaultI18nService();

    it('Reads default language from config', () => {
        expect(_i18nService.getCurrentUserLanguage()).to.equal('am')
    });

    it('Reads locale strings properly', () => {
        expect(_i18nService._('CANCEL')).to.equal('ተወው')
    });

    it('Returns key when not found.', () => {
        expect(_i18nService._('GO')).to.equal('GO')
    });

    it('Changes user language properly', () => {
        _i18nService.changeLanguage('en')
        expect(localStorage.getItem('userLanguage')).to.equal('en')
        expect(_i18nService.getCurrentUserLanguage()).to.equal('en')
        expect(_i18nService._('CANCEL')).to.equal('Cancel')
    });

    it('Falls back to default language when key is not found.', () => {
        _i18nService.changeLanguage('en')
        expect(_i18nService.getCurrentUserLanguage()).to.equal('en')
        expect(_i18nService._('OK')).to.equal('እሺ')
    });

    it('Supports translations with parameters', () => {
        _i18nService.changeLanguage('en')
        expect(_i18nService._('PARAMETERIZED', 'a', 2)).to.equal('Accept a and 2')
    });

    it('Adds new translations properly', () => {
        _i18nService.addTranslations({
            en: {ACCEPT: 'Accept'},
            de: {ACCEPT: 'akzeptieren'}
        })
        expect(_i18nService._('ACCEPT')).to.equal('Accept')
        _i18nService.changeLanguage('de')
        expect(_i18nService._('ACCEPT')).to.equal('akzeptieren')
    });

});