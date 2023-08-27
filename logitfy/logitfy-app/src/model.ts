export enum State {
    Waiting = "WAITING",
    Running = "RUNNING",
    Finished = "FINISHED",
}

export type LoggingRequest = {
    id: string
    rootRepository: string
    submoduleNames: string[]
    startRef: string
    endRef: string
    jsonUri?: string
    htmlUri?: string
    state: State
    errorMessage?: string
    stackTrace?: string
}