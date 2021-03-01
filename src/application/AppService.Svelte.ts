import {AppInitOptions, AppService} from "./AppService";

export interface SvelteAppInitOptions extends AppInitOptions {
    rootComponent,
    mountOn: HTMLElement
}

export function GetSvelteAppService() {
    return {
        createApp(options: SvelteAppInitOptions) {
            let targetElt = options.mountOn ?? document.body;
            return new options.rootComponent({
                target: targetElt
            });
        }
    }
}