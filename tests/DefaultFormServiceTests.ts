import { describe } from 'mocha';
const chai = require('chai');
import spies from 'chai-spies';
import * as mockery from 'mockery';
import * as commonUtils from '../src/common/utilities'

const expect = chai.expect;
chai.use(spies);
mockery.enable();

const validationService = {
    notEmpty(val) {}
};
mockery.registerMock('common/utilities', commonUtils);
mockery.registerMock('container/config', {});
mockery.registerMock('container/validation', validationService);
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
        let config = _formService.create(forObject, {
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

    it('Validates forms correctly', async () => {
        let forObject = {userName: '', age: 17, email: 'abe@example.com', city: ''};
        let config = _formService.create(forObject, {
            showLabel: false,
            fieldsConfig: {
                userName: {required: true},
                email: {required: true},
                age: {validate: async val => (val > 18 ? '' : 'AGE_18_OR_ABOVE')}
            }
        });
        let requiredValidator = chai.spy.on(validationService, 'notEmpty')
        let validationResult = await _formService.validateForm(forObject, config);

        expect(validationResult.hasError).to.be.true;
        expect(requiredValidator).to.have.been.called();
        expect(validationResult.fields.city.hasError).to.be.false;
        expect(validationResult.fields.age.hasError).to.be.true;
        expect(validationResult.fields.age.errorMessage).to.equal('AGE_18_OR_ABOVE');
        expect(validationResult.fields.email.hasError).to.be.false;
    });

    it('Does form level validation', async () => {
        let registration = {userName: '', password: 'a', confirmPassword: 'b'};
        let formConfig = _formService.create(registration, {
            validate: form => (form.password != form.confirmPassword ? 'UN_MATCHING_PASSWORDS' : '')
        });
        let validationResult = await _formService.validateForm(registration, formConfig);
        expect(validationResult.hasError).to.be.true;
        expect(validationResult.errorMessage).to.equal('UN_MATCHING_PASSWORDS');
    });

});