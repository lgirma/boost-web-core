import _config from "container/config";
import {FormValidationResult} from "ui/FormModels";
import {HttpConfig} from "../http";
import {getFriendlyFileSize} from "common/utilities";


const special_char_regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export const FILE_TYPES = {
    IMAGES: 'images',
    DOCUMENTS_AND_IMAGES: 'images and PDF documents'
};

export function GetDefaultValidationService() {
    return {

        notEmpty(val, errorMsg = 'Please, fill out this field.') {
            if (val == null || val.trim().length === 0) return errorMsg;
            return ''
        },

        validName(val, errorMsg = 'Please, fill in an appropriate name') {
            if (val == null || val.trim().length === 0 || /[<>/\\{}*#~`%]+$/.test(val)) return errorMsg;
            return '';
        },

        getMinLenValidator(length = 1) {
            return val => {
                if (val == null || val.trim().length === 0)
                    return 'Please, fill out this field.'
                else if (val.length < length)
                    return`Should have at least ${length} characters.`
                return ''
            }
        },

        notEmptyFile(val, errorMsg = 'Please, upload a file.') {
            if (val == null) return errorMsg
            else if (val.uuid) return ''
            else if (val.uploadedFiles == null) return errorMsg
            else if (val.uploadedFiles.length === 0) return errorMsg
            return ''
        },

        docTypeFile(val, errorMsg = 'Please, upload only images or a PDF document') {
            if (val == null || val.uploadedFiles == null || val.uploadedFiles.length === 0)
                return '';
            if (val.uploadedFiles[0].type.indexOf('image/') === -1 && val.uploadedFiles[0].type.indexOf('application/pdf') === -1)
                return errorMsg;
            return ''
        },

        imgTypeFile(val, errorMsg = 'Please, upload only images') {
            if (val == null || val.uploadedFiles == null || val.uploadedFiles.length === 0)
                return '';
            if (val.uploadedFiles[0].type.indexOf('image/') === -1)
                return errorMsg;
            return ''
        },

        strongPassword({minLength = 8, specialChars = true} = {}) {
            return val => {
                if (val == null || val.trim().length === 0)
                    return 'Please, fill out this field.'
                else if (val.length < minLength)
                    return`Password should have at least ${minLength} characters.`
                else if (val.toLowerCase() === val || val.toUpperCase() === val)
                    return 'Password should have at least 1 capital and 1 small letter.'
                else if (specialChars && !special_char_regex.test(val))
                    return 'Password should have at least one special character (*!@#$%^&*).'
                return ''
            }
        },

        maxFileSize(val, errorMsg = 'Please, upload a file less than {0}') {
            const bytes = _config.get<HttpConfig>('http').MaxUploadFileSize || 1024*1024*10;
            if (val == null || val.uploadedFiles == null || val.uploadedFiles.length === 0)
                return '';
            if (val.uploadedFiles[0].size > bytes)
                return errorMsg.replace('{0}', getFriendlyFileSize(bytes));
            return ''
        },

        async parseValidationResult(apiResult) {
            let result : FormValidationResult = {
                hasErrors: false,
                fields: {}
            };
            if (apiResult && apiResult.code === 'ValidationError' && apiResult.details) {
                let keys = Object.keys(apiResult.details)
                for (let i=0; i<keys.length; i++) {
                    let fieldId = keys[i]
                    if (apiResult.details[fieldId].length) {
                        result.hasErrors = true
                        fieldId = fieldId.slice(0, 1).toLowerCase() + fieldId.slice(1)
                        result.fields[fieldId] = {
                            hasError: true,
                            errorMessage: 'Please, check this input'
                        }
                    }
                }
            }
            return result;
        }
    }
}