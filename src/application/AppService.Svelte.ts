import {AppInitOptions, AppService} from "./AppService";
import {SvelteComponent} from "svelte";

export interface SvelteAppInitOptions extends AppInitOptions {
    rootComponent
}

export const SvelteApp: AppService = {
    createApp(setup, options: SvelteAppInitOptions) {
        let targetElt = document.body;
        return new options.rootComponent({
            target: targetElt
        });
    }
}