import { Job, JobState } from '../../src/job';
import { waitUntil } from '../../src/wait';

describe('Job tests', () => {
    it('starts out in pending', () => {
        const job = new Job(async () => {});
        expect(job.getState()).toBe(JobState.Pending);
    });

    it('moves to running while the job is in progress', () => {
        const stop = false;
        const job = new Job(async () => {
            waitUntil(() => stop, 1000, 50);
        });
        job.run();

        expect(job.getState()).toBe(JobState.Running);
    });

    it('moves to done once the job is done', async () => {
        let stop = false;
        const job = new Job(async () => {
            await waitUntil(() => stop, 1000, 50);
        });
        job.run();

        stop = true;

        await waitUntil(() => job.getState() === JobState.Done, 1000, 50);
        expect(job.getState()).toBe(JobState.Done);
    });

    it('swallows excpetions', async () => {
        const job = new Job(async () => {
            throw new Error('Whoops!');
        });

        await job.run();

        expect(job.getState()).toBe(JobState.Done);
    });
});
