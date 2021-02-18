export interface BusyBarOptions {
    thickness?: number,
    color?: string
}

export interface BusyBarService {
    start(bar?)
    stop(bar?)
    createBar(options: BusyBarOptions) : void
}