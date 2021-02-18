import {AppConfig} from "config/AppConfig";

export interface HttpConfig extends AppConfig {
    ApiUrl: string
    WebUrl: string
    MaxFileSize: number
}