import { describe } from 'mocha';
import { expect } from 'chai';
import * as container from '../src/container';
import {AppConfig, ConfigService, Configurable, DefaultConfigService} from "../src/config";
import {dep} from "../src/container";

type SimpleTestService = {getAppTitle(): string}
type GreeterConfig = AppConfig & { subject: string }
type GreeterService = {greet(): string}

function getSimpleTestService(resolver) {
    return (dependencies = {appConfig: null}) => {
        const {appConfig} = resolver(dependencies);
        return {
            getAppTitle() {
                return `${appConfig.get('APP_NAME')} @${appConfig.get('VERSION')}`
            }
        }
    }
}

function getGreeterService(resolver) {
    return (dependencies = {appConfig: dep<ConfigService>()}) : GreeterService & Configurable<GreeterConfig> => {
        const {appConfig} = resolver(dependencies);
        return {
            defaultConfig() {
                return {
                    greeter: {
                        subject: 'Test'
                    }
                };
            },
            greet() {
                return `Hello, ${(appConfig as ConfigService).get<GreeterConfig>('greeter').subject} World!`
            }
        }
    }
}

const config = {
        APP_NAME: 'Test App',
        VERSION: '1.0'
    };

describe('Container setup methods', () => {
    it('sets up properly', () => {
        container.init(() => ({
            appConfig: new DefaultConfigService(config),
            testService: getSimpleTestService(container.resolve)
        }));

        const {testService} = container.resolve({testService: container.dep<SimpleTestService>()})

        expect(container.getResolvedServices())
            .to.ownProperty('testService');
    });

    it('resolves services', () => {
        container.init(() => ({
            appConfig: new DefaultConfigService(config),
            testService: getSimpleTestService(container.resolve)
        }));

        const {testService} = container.resolve({testService: container.dep<SimpleTestService>()})

        expect(testService.getAppTitle())
            .to.equal('Test App @1.0')
    });

    it('resolves services with sub-configuration', () => {
        container.init(() => ({
            appConfig: new DefaultConfigService(config),
            testService: getSimpleTestService(container.resolve),
            greeterService: getGreeterService(container.resolve)
        }));

        const {greeterService, appConfig} = container.resolve({
            greeterService: container.dep<GreeterService>(),
            appConfig: null
        });

        console.log('Configuration', appConfig);

        expect(greeterService.greet())
            .to.equal('Hello, Test World!')
    });
})