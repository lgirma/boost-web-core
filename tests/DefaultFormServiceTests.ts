import { describe } from 'mocha';
import { expect } from 'chai';
import * as mockery from 'mockery';
import * as commonUtils from '../src/common/utilities'

mockery.enable();

mockery.registerMock('common/utilities', commonUtils);
import {GetDefaultFormService} from "../src/ui/FormService";

mockery.disable();

describe('Form service tests', () => {

    const _formService = GetDefaultFormService();

    it('Guesses types correctly', () => {
        expect(_formService.guessType('password', null)).to.equal('password');
        expect(_formService.guessType('a', 1)).to.equal('number');
        expect(_formService.guessType('b', 'a')).to.equal('text');
        expect(_formService.guessType('b', null)).to.equal('text');
        expect(_formService.guessType('b', true)).to.equal('checkbox');
        expect(_formService.guessType('email', '')).to.equal('email');
    });

    it('Sets up form config properly', () => {
        let forObject = {userName: '', password: '', rememberMe: false, agreeToTerms: false};
        let config = _formService.create(forObject,{
            showLabel: false,
            fieldsConfig: {
                agreeToTerms: {
                    label: "I agree to terms",
                    showLabel: true
                }
            }
        })
        expect(config.fieldsConfig['userName'].label).to.equal('User Name');
        expect(config.fieldsConfig['userName'].id).to.equal('userName');
        expect(config.fieldsConfig['userName'].showLabel).to.equal(false);
        expect(config.fieldsConfig['password'].label).to.equal('Password');
        expect(config.fieldsConfig['password'].id).to.equal('password');
        expect(config.fieldsConfig['rememberMe'].label).to.equal('Remember Me');
        expect(config.fieldsConfig['rememberMe'].id).to.equal('rememberMe');
        expect(config.fieldsConfig['agreeToTerms'].label).to.equal('I agree to terms');
        expect(config.fieldsConfig['agreeToTerms'].id).to.equal('agreeToTerms');
        expect(config.fieldsConfig['agreeToTerms'].showLabel).to.equal(true);
    });

});