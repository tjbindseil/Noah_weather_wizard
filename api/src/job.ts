export enum JobState {
    Pending,
    Running,
    Done,
}

export class Job {
    private state = JobState.Pending;
    constructor(
        private readonly workFunc: () => Promise<void>,
        private readonly jobDescription = ''
    ) {}

    public getState(): JobState {
        return this.state;
    }

    public async run(): Promise<void> {
        this.state = JobState.Running;
        try {
            await this.workFunc();
        } catch (e: unknown) {
            console.error(
                `issue running job: ${
                    this.jobDescription
                }, error is: ${JSON.stringify(e)}`
            );
        } finally {
            this.state = JobState.Done;
        }
    }
}
