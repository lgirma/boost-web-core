import { describe } from 'mocha';
const chai = require('chai');
const expect = chai.expect;

import {
    isEmpty, getFriendlyFileSize, humanize, camelToKebabCase, kebabToCamelCase,
    isDate, isYear, isFunc, isTime, toArray
} from '../src/Utilities'

describe('Utilities tests', () => {

    it('Humanizes texts properly', () => {
        expect(humanize('Gone')).to.equal('Gone');
        expect(humanize('gone')).to.equal('Gone');
        expect(humanize('goneWithIt')).to.equal('Gone With It');
        expect(humanize('gone_with_it')).to.equal('Gone with it');
    });

    it('Converts camel case to kebab case properly', () => {
        expect(camelToKebabCase('camelCaseStringValue')).to.equal('camel-case-string-value');
        expect(camelToKebabCase('aABC')).to.equal('a-a-b-c');
    });

    it('Converts kebab case to camel case properly', () => {
        expect(kebabToCamelCase('camel-case-string-value')).to.equal('camelCaseStringValue');
        expect(kebabToCamelCase('a-a-b-c')).to.equal('aABC');
    });

    it('Friendly file sizes', () => {
        expect(getFriendlyFileSize(1024)).to.equal('1 Kb');
        expect(getFriendlyFileSize(1024**2)).to.equal('1 Mb');
    });

    it('Checks if a string is whitespace or null', () => {
        expect(isEmpty('')).to.equal(true);
        expect(isEmpty(' \n')).to.equal(true);
        expect(isEmpty(null)).to.equal(true);
        expect(isEmpty('a')).to.equal(false);
    });

    it('Checks if a string is a date', () => {
        expect(isDate('2010-01-01')).to.equal(true);
        expect(isDate('2010/30/01')).to.equal(true);
        expect(isDate('2010/05/31')).to.equal(true);
        expect(isDate('2010-01-015')).to.equal(false);
    });

    it('Checks if a string is a year', () => {
        expect(isYear('2010')).to.equal(true);
        expect(isYear('5263')).to.equal(false);
        expect(isYear('20100')).to.equal(false);
        expect(isYear('2-2100')).to.equal(false);
    });

    it('Checks if a string is a time', () => {
        expect(isTime('00:00:00')).to.equal(true);
        expect(isTime('000')).to.equal(false);
        expect(isTime('00:45')).to.equal(true);
        expect(isTime('00:00')).to.equal(true);
        expect(isTime('4 00:00')).to.equal(false);
    });

    it('Checks if a value is a function', () => {
        expect(isFunc(() => {})).to.equal(true);
        expect(isFunc(async () => {})).to.equal(true);
        expect(isFunc(null)).to.equal(false);
        expect(isFunc([])).to.equal(false);
    });

    it('Converts one or many values to array', () => {
        expect(toArray(5)).deep.to.equal([5]);
        expect(toArray([3, 5])).deep.to.equal([3, 5]);
        expect(toArray(null)).deep.to.equal([]);
    });

});