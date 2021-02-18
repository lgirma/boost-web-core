import {DependencySetup} from "container";

export interface AppInitOptions {

}

export interface AppService {
    createApp(setup: DependencySetup, options: AppInitOptions);
}