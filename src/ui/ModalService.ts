import {Size} from "./Size";

export interface ModalOptions extends GlobalModalOptions {
    id: number
}

export interface ModalState extends GlobalModalOptions {
    isShown?: boolean
}

export interface GlobalModalOptions {
    title?: string,
    body?: string,
    isBodyHtml?: boolean
    acceptButtonTitle?: string,
    cancelButtonTitle?: string,
    onAccept: (e) => void,
    onCancel: (e) => void,
    hideCancelButton?: boolean,
    dontCloseOnAccept?: boolean,
    size?: Size
}

export interface ModalService {
    showModal(id: string, options?: GlobalModalOptions);
    hideModal(id: string, options?);
}