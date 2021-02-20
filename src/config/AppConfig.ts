export interface AppConfig {

}

export interface ConfigService {
    get<T>(section: string, defaultValue?: T): T;
    append(configObject);
}

export class DefaultConfigService implements ConfigService {
    private _configObject : AppConfig = {}

    get<T>(sectionName: string, defaultValue = {}): T {
        let result = this._configObject[sectionName];
        result = {
            ...result,
            ...defaultValue
        }
        return result;
    }

    append(configObject) {
        Object.keys(configObject)
            .forEach(configKey => this._configObject[configKey] = configObject[configKey])
    }

    constructor(startWith = {}) {
        if (startWith != null)
            this._configObject = startWith;
    }
}

export interface Configurable<T extends AppConfig> {
    getConfig(): T;
}