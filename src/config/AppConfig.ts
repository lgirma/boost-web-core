export interface AppConfig {

}

export interface ConfigService {
    get<T>(section: string): T;
    append(configObject);
}

export class DefaultConfigService implements ConfigService {
    private _configObject : AppConfig = {}

    get<T>(section: string): T {
        return this._configObject[section]
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
    defaultConfig() : {[key: string]: T};
}