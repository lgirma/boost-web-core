import {humanize} from 'common/utilities';
import {FormValidationResult, FieldValidationResult} from "ui/FormModels";
import _validator from 'container/validation'

export type ValidateFunc = any//(val) => Promise<string>

export type FormFieldType = 'text' | 'email' | 'password' | 'file' | 'select' | 'autocomplete' |
    'checkbox' | 'number' | 'date' | 'datetime' | 'time' | 'textarea' | 'markdown' | 'reCaptcha';

export interface FormConfigBase {
    validate?: ValidateFunc | ValidateFunc[],
    scale?: number
    id?: string
    readonly?: boolean
    showLabel?: boolean
}

export interface FieldConfigBase extends FormConfigBase {
    icon?: string
    type?: FormFieldType
    required?: boolean
    helpText?: string
    label?: string
    placeholder?: string
    validationResult?: FieldValidationResult
    customOptions?: any
}

export type FieldsConfig = {
    [key: string]: FieldConfigBase;
}

export interface WebForm extends FormConfigBase {
    columns?: number
    fieldsConfig?: FieldsConfig
}

export class FormService {

    create(forObject, config: WebForm): WebForm {
        config.fieldsConfig ??= {};
        config.scale ??= 1;
        config.readonly ??= false;
        config.showLabel ??= true;
        config.columns ??= 1;
        if (config.columns < 1)
            config.columns = 1;

        Object.entries(forObject).forEach(_ => {
            let fieldId = _[0];
            let fieldValue = forObject[fieldId];

            config.fieldsConfig[fieldId] = {
                scale: config.scale,
                readonly: config.readonly,
                showLabel: config.showLabel,
                icon: null,
                helpText: '',
                validationResult: {
                    errorMessage: '',
                    hasError: false
                },
                id: fieldId,
                required: false,
                placeholder: null,
                label: humanize(fieldId),
                ...config.fieldsConfig[fieldId]
            }
            if (config.fieldsConfig[fieldId].type == null)
                config.fieldsConfig[fieldId].type = this.guessType(fieldId, fieldValue);
        });

        return config;
    }

    guessType(fieldId, fieldValue): FormFieldType {
        if (fieldId === 'password')
            return 'password';
        if (fieldId === 'email')
            return 'email';
        if (fieldValue == null)
            return 'text';

        const jsType = typeof(fieldValue);

        if (jsType === 'boolean')
            return 'checkbox';
        if (jsType === 'string')
            return 'text';
        if (jsType === 'number')
            return 'number';

        return 'text';
    }

    async validateForm(forObject, fieldsConfig: FieldsConfig) : Promise<FormValidationResult> {
        let result: FormValidationResult = {
            hasErrors: false,
            fields: {}
        };
        for (const id in forObject) {
            if (!forObject.hasOwnProperty(id))
                continue;
            const config = fieldsConfig[id]
            result.fields[id] = {
                hasError: false,
                errorMessage: null
            }
            if (config == null) continue
            let validate = config.validate
            const value = forObject[id]
            if (config.required) {
                if (validate == null) validate = _validator.notEmpty;
                else if (validate.constructor === Array)
                    validate.push(_validator.notEmpty);
                else validate = [validate as ValidateFunc, _validator.notEmpty]
            }
            else if (validate == null) continue

            let errorMsg = ''
            try {
                if (validate.constructor === Array) {
                    for (let i = 0; i < validate.length; i++) {
                        const v = validate[i];
                        errorMsg = await v(value);
                        if (errorMsg) break;
                    }
                }
                else {
                    errorMsg = await validate(value);
                }
            } catch (ex) {
                errorMsg = 'Failed to validate this entry.'
            }
            result.fields[id].errorMessage = errorMsg
            result.fields[id].hasError = errorMsg != null && errorMsg.length > 0
        }
        result.hasErrors = Object.values(result.fields).reduce((p, n) => p || n.hasError, false)
        return result
    }

}

export function GetDefaultFormService(): FormService {
    return new FormService();
}