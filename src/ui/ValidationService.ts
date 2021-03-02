import _config from "container/config";
import {FormValidationResult, ValidateFunc} from "ui/FormModels";
import {HttpConfig} from "../http";
import {getFriendlyFileSize, isEmpty} from "common/utilities";
import i18nRes from './validation.i18n';
import _i18n from 'container/i18n';
import {i18nResource} from "../i18n";


const special_char_regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

export const FILE_TYPES = {
    IMAGES: 'images',
    DOCUMENTS_AND_IMAGES: 'images and PDF documents'
};

export function GetDefaultValidationService() {
    _i18n.addTranslations(i18nRes);
    return {

        notEmpty(val, errorMsg = '') {
            return isEmpty(val) ? errorMsg : '';
        },

        validName(val, errorMsg = _i18n._('VALIDATION_MESSAGE_EMPTY')) {
            if (isEmpty(val) || /[<>/\\{}*#~`%]+$/.test(val)) return errorMsg;
            return '';
        },

        getMinLenValidator(length = 1): ValidateFunc {
            return val => {
                if (val == null || val.trim().length === 0)
                    return _i18n._('VALIDATION_MESSAGE_EMPTY')
                else if (val.length < length)
                    return _i18n._('VALIDATION_MESSAGE_MIN_LENGTH', length)
                return ''
            }
        },

        notEmptyFile(val, errorMsg = _i18n._('VALIDATION_MESSAGE_UPLOAD_EMPTY')) {
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

        imgTypeFile(val, errorMsg = _i18n._('VALIDATION_MESSAGE_UPLOAD_IMAGE_ONLY')) {
            if (val == null || val.uploadedFiles == null || val.uploadedFiles.length === 0)
                return '';
            if (val.uploadedFiles[0].type.indexOf('image/') === -1)
                return errorMsg;
            return ''
        },

        getStrongPasswordValidator({minLength = 8, specialChars = true} = {}) {
            return val => {
                if (val == null || val.trim().length === 0)
                    return _i18n._('VALIDATION_MESSAGE_EMPTY')
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
                hasError: false,
                errorMessage: '',
                fields: {}
            };
            if (apiResult && apiResult.code === 'ValidationError' && apiResult.details) {
                let keys = Object.keys(apiResult.details)
                for (let i=0; i<keys.length; i++) {
                    let fieldId = keys[i]
                    if (apiResult.details[fieldId].length) {
                        result.hasError = true
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