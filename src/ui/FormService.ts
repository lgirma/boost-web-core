import {humanize} from 'common/utilities';

type ValidateFunc = (any) => Promise<string>;

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
    validationResult?: FieldValidationResult,
    options?: any
}

export interface WebForm extends FormConfigBase {
    columns?: number
    forObject: any,
    formConfig?: {
        [key: string]: FieldConfigBase;
    }
}

export interface FieldValidationResult {
    errorMessage: string,
    hasError: boolean
}

export interface FormValidationResult {
    hasErrors: boolean,
    fields: {
        [key: string]: FieldValidationResult;
    }
}

export class FormService {

    create(config: WebForm): WebForm {
        config.formConfig ??= {};
        config.scale ??= 1;
        config.readonly ??= false;
        config.showLabel ??= true;
        config.columns ??= 1;
        if (config.columns < 1)
            config.columns = 1;

        Object.entries(config.forObject).forEach(_ => {
            let fieldId = _[0];
            let fieldValue = config.forObject[fieldId];

            config.formConfig[fieldId] = {
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
                ...config.formConfig[fieldId]
            }
            if (config.formConfig[fieldId].type == null)
                config.formConfig[fieldId].type = this.guessType(fieldId, fieldValue);
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

    async validateForm(form: WebForm) : Promise<FormValidationResult> {
        const {forObject, formConfig} = form;
        let result: FormValidationResult = {
            hasErrors: false,
            fields: {}
        };
        for (const id in forObject) {
            if (!forObject.hasOwnProperty(id))
                continue;
            const config = formConfig[id]
            result.fields[id] = {
                hasError: false,
                errorMessage: null
            }
            if (config == null) continue
            const validate = config.validate
            if (validate == null) continue
            const value = forObject[id]

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
                    errorMsg = await (validate as ValidateFunc)(value);
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