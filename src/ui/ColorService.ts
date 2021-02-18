import {MessageType} from "./MessageType";

export interface ColorService {
    getClassesFor(messageType: MessageType);
}