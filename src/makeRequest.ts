export const makeRequest = async (url: string) => {
    const fetchResponse = await fetch(url);
    const fetchResponseJson = await fetchResponse.json();
    if (fetchResponse.status === 200) {
        return fetchResponseJson;
    } else {
        console.error(
            `issue making request, status is: ${fetchResponse.status} and message is: ${fetchResponseJson}`
        );
        throw Error();
    }
};
