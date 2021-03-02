
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