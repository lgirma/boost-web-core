export interface AppConfig {

}

export interface ConfigService {
    get<T>(section: string, defaultValue?: T): T;
    append(configObject);
}

export function GetDefaultConfigService(startWith: any = {}) : ConfigService {
    let result = {
        _configObject: {} as AppConfig,
        get<T>(sectionName: string, defaultValue: T = null as any): T {
            let result = this._configObject[sectionName];
            if (defaultValue != null) {
                result = {
                    ...defaultValue,
                    ...result,
                }
                this._configObject[sectionName] = result;
            }
            return result;
        },

        append(configObject) {
            Object.keys(configObject)
                .forEach(configKey => this._configObject[configKey] = configObject[configKey])
        }
    };

    if (startWith != null)
        result._configObject = startWith;

    return result;
}

export interface Configurable<T extends AppConfig> {
    getConfig(): T;
}