import {GlobalModalOptions} from "./ModalService";
import {MessageType} from "./Common";

export abstract class DialogService {

    abstract showConfirm(question?: string, options?: GlobalModalOptions);
    abstract showMessage(message: string, messageType?: MessageType, options?: GlobalModalOptions);
    async showConfirmAsync(question?: string, options?: GlobalModalOptions) : Promise<boolean> {
        return new Promise(
            (resolve, reject) => this.showConfirm(question,{
                ...options,
                onAccept: e => resolve(true),
                onCancel: e => resolve(false)
            })
        );
    }
}