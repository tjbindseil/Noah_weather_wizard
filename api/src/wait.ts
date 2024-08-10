export const waitUntil = async (
    conditionEvaluator: () => boolean,
    timeoutMS = 2000,
    intervalMS = 50
): Promise<boolean> => {
    let totalWaitTimeMS = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        await new Promise((r) => setTimeout(r, intervalMS));
        totalWaitTimeMS += intervalMS;
        if (conditionEvaluator()) {
            return true;
        }
        if (totalWaitTimeMS > timeoutMS) {
            return false;
        }
    }
};

export const waitForMS = async (howLong: number): Promise<void> => {
    await new Promise((r) => setTimeout(r, howLong));
};
