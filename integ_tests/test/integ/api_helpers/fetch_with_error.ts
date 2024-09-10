const defaultRequestInit: Partial<RequestInit> = {
    mode: 'cors',
};

export const fetchWithError = async <T>(
    action: string,
    url: string,
    requestInit?: RequestInit
): Promise<T> => {
    const requestInitWithDefaults = {
        ...defaultRequestInit,
        ...requestInit,
    };

    const fetchResponse = await fetch(url, requestInitWithDefaults);

    let output: unknown;
    try {
        output = await fetchResponse.json();
    } catch (e: unknown) {
        console.error(
            `fetchWithError: issue reading output as json, e is: ${e}`
        );
    }

    if (fetchResponse.status !== 200) {
        console.error(
            `issue during ${action}, resonse is: ${
                fetchResponse.status
            } - ${JSON.stringify(output)}`
        );
        throw Error('fetch failed!');
    }

    return output as T;
};

// TODO:
// * include get/post differences? - no, seems just as easy to include it in each request
// * include auth stuff? - hmm
