import {MessageType} from "./MessageType";

export interface IconOptions {
    scale?: number
}

export interface IconService {
    renderIcon(key: string, options?: IconOptions): string
    getIcon(message: MessageType): string
    getDefaultOptions(): any;
}