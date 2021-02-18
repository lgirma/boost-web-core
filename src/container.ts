import {DefaultConfigService} from "./config";

export type DependencySetup = () => {[dependencyName: string]: any}

function resolveNewService<T>(factoryKey: string): T {
    const resolvedFactory = factories[factoryKey];
    let resolvedService = null;

    if (resolvedFactory == null) {
        if (factoryKey == 'appConfig')
            resolvedService = new DefaultConfigService();
    }
    else if (typeof resolvedFactory === 'function')
        resolvedService = resolvedFactory();
    else if (typeof resolvedFactory === 'object')
        resolvedService = resolvedFactory;

    resolvedServices[factoryKey] = resolvedService;
    if (resolvedService == null)
        return null;

    if (resolvedService.init && typeof resolvedService.init === 'function')
        resolvedService.init();

    if (resolvedService.defaultConfig && typeof resolvedService.defaultConfig === 'function') {
        const customConfig = resolvedService.defaultConfig();
        Object.keys(customConfig)
            .forEach(configKey => resolvedServices.appConfig[configKey] = customConfig[configKey])
    }

    return resolvedService;
}

export type DependencyResolver<T> = (args: T) => T;

export function resolve<T>(args: T): T {
    const reducer = (acc: T, factoryKey: string) => {
        let resolvedService = resolvedServices[factoryKey] ?? resolveNewService<T>(factoryKey);
        return {...acc, [factoryKey]: resolvedService}
    }
    return Object.keys(args).reduce(reducer, {} as T);
}

export function resolveService<T>(key: string): T {
    return resolve({[key]: null})[key];
}

export function init(setup: DependencySetup) {
    const tree = setup();
    factories = {...tree};
}

export function getResolvedServices() {
    return resolvedServices;
}

/**
 * Helps specify a dependency
 */
export function dep<T>(): T {
    return null as T;
}

var factories = {}
var resolvedServices = {
    appConfig: null
};