import { validate } from 'ww-3-api-tjb';
import { IUserService } from './user_service';

export enum HTTPMethod {
  DELETE = 'DELETE',
  POST = 'POST',
  GET = 'GET',
}

const getHeaders = (userService?: IUserService) => {
  const headers: HeadersInit = userService
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${userService.getAccessToken()}`,
      }
    : {
        'Content-Type': 'application/json',
      };
  return headers;
};

export async function fetchWithError<I, O>(
  input: I,
  url: string,
  method: HTTPMethod,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  outputSchema: any,
  userService?: IUserService,
): Promise<O> {
  const fetchFunc = async () => {
    return await fetch(url, {
      method: method.toString(),
      mode: 'cors',
      headers: getHeaders(userService),
      body: JSON.stringify({
        ...input,
      }),
    });
  };

  let result = await fetchFunc();

  if (result.status === 401) {
    if (userService) {
      await userService?.refreshUser();
      result = await fetchFunc();
    }
  }

  if (result.status !== 200) {
    throw new Error();
  }

  const validatedOutput = validate(outputSchema, await result.json()) as unknown as O;

  return validatedOutput;
}

export async function getWithError<O>(
  input: Record<string, string>,
  url: string,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  outputSchema: any,
  userService?: IUserService,
): Promise<O> {
  const result = await fetch(`${url}?` + new URLSearchParams({ ...input }), {
    method: HTTPMethod.GET.toString(),
    mode: 'cors',
    headers: await getHeaders(userService),
  });

  if (result.status !== 200) {
    throw new Error();
  }

  const validatedOutput = validate(outputSchema, await result.json()) as unknown as O;

  return validatedOutput;
}
