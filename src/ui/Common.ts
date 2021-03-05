export enum MessageType {
    NONE,
    SUCCESS,
    ERROR,
    WARNING,
    INFO
}

export enum LightingType {
    LIGHT,
    WHITE,
    DARK,
    BLACK
}

export enum MaterialType {
    /**
     * Emphasis on the foreground/text. Message is reflected/communicated through the content.
     */
    REGULAR,
    /**
     * Emphasis on the background. Message is reflected/communicated through the background.
     */
    SOLID,
    /**
     * Emphasis on the border and foreground. Message is reflected/communicated through the border and content.
     */
    OUTLINED
}

export enum Temperature {
    WARM,
    COLD
}

export interface Themeable {
    message?: MessageType
    lighting?: LightingType
    material?: MaterialType,
    temperature?: Temperature,

    /**
     * Defaults to 1.
     */
    scale?: number
}

export interface UIElement extends Themeable {
    /**
     * Defaults to 0. In the scale of 0 (sharp rectangle) to 1 (perfect circle)
     */
    roundness?: number
    /**
     * Defaults to 1. In the scale of 0 (transparent) to 1 (opaque)
     */
    opacity?: number
    /**
     * Defaults to 0. Using shadow to create an illusion of elevation.
     */
    elevation?: number
}