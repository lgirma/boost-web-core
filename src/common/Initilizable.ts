export interface Initilizable {
    init(): void
    initAsync?(): Promise<void>
}