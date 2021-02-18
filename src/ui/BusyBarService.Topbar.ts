import topbar from "topbar";
import {BusyBarService, BusyBarOptions} from './BusyBarService';

export function topBarService(): BusyBarService {
    return {
        createBar(options: BusyBarOptions = {}) {
            const {color, thickness} = options;
            topbar.config({
                barThickness : thickness || 4,
                barColors    : {
                    '0' : color || 'rgba(0,0,0,.9)',
                    //'.3'       : 'rgba(41,  128, 185, .7)',
                    '1.0' : color || 'rgba(0,0,0,.9)'
                },
            });
            return 1;
        },
        start(bar?) { topbar.show() },
        stop(bar?) { topbar.hide() },
    }
}