import {AppInitOptions, AppService} from "./AppService";

export interface SvelteAppInitOptions extends AppInitOptions {
    rootComponent,
    mountOn: HTMLElement
}

export const GetSvelteAppService = (): AppService => ({
    createApp(options: SvelteAppInitOptions) {
        let targetElt = options.mountOn ?? document.body;
        return new options.rootComponent({
            target: targetElt
        });
    }
})