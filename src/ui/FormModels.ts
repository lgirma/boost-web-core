
export interface ValidationResult {
    errorMessage: string,
    hasError: boolean
}

export interface FormValidationResult extends ValidationResult{
    fields: {
        [key: string]: ValidationResult;
    }
}

export function getValidationResult(errorMessage?: string): ValidationResult {
    return {
        errorMessage: errorMessage ?? '',
        hasError: (errorMessage != null && errorMessage.trim().length > 0)
    }
}

export type AsyncValidateFunc = (val, errorMessage?: string) => Promise<string>
export type ValidateFunc = AsyncValidateFunc | ((val, errorMessage?: string) => string)
export type FormValidateFunc = (formData: any) => Promise<string>