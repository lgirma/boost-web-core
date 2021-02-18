import {MessageType} from "./MessageType";
import {ScreenPosition} from "./ScreenPosition";
import _i18n from 'container/i18n';

const _ = _i18n._;

export abstract class ToastService {
    abstract show(options?: ToastMessage);
    abstract hide();

    showSuccess(message: string, options?: ToastMessage) {
        this.show({
            title: _('SUCCESS'),
            ...options,
            body: message,
            type: MessageType.SUCCESS
        });
    }

    showError(message: string, options?: ToastMessage) {
        this.show({
            title: _('FAILED'),
            ...options,
            body: message,
            type: MessageType.ERROR
        });
    }

    showInfo(message: string, options?: ToastMessage) {
        this.show({
            title: _('INFO'),
            ...options,
            body: message,
            type: MessageType.INFO
        });
    }

    showWarning(message: string, options?: ToastMessage) {
        this.show({
            title: _('WARNING'),
            ...options,
            body: message,
            type: MessageType.WARNING
        });
    }
}

export interface ToastMessage {
    type?: MessageType
    autoHide?: boolean
    timeout?: number,
    title?: string
    titleDescription?: string
    body?: string,
    bodyHtml?: boolean
    position?: ScreenPosition
}