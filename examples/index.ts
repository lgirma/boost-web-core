import {SvelteApp} from "application/AppService.Svelte";
import {setup} from "./setup";
import App from './App.svelte'

export default SvelteApp.createApp(setup, App);