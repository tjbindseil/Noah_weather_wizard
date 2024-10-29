import {
  PostAuthInput,
  PostAuthOutput,
  PostConfirmationInput,
  PostRefreshOutput,
  PostUserInput,
  _schema,
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { defaultVerifier } from 'ww-3-api-tjb';
import Ajv from 'ajv';
import { TokenStorageObject } from './utils/token_storage_obj';
import { useEffect } from 'react';

export interface IUserService {
  createUser(postUserInput: PostUserInput): Promise<void>;
  authorizeUser(postAuthInput: PostAuthInput): Promise<void>;
  confirmUser(postConfirmationInput: PostConfirmationInput): Promise<void>;
  deleteUser(): Promise<void>;
  signedIn(): boolean;
  getUsername(): string | undefined;
  logout(): void;
}

export const UserServiceContext = Contextualizer.createContext(ProvidedServices.UserService);
export const useUserService = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

interface UserServiceImpl extends IUserService {
  refreshUser(): Promise<void>;
  username: string | undefined;
  setUsername: () => Promise<void>;
}

const ajv = new Ajv();

/* eslint-disable  @typescript-eslint/no-explicit-any */
const UserService = ({ children }: any) => {
  const baseUrl = 'http://localhost:8082';
  const postUserOutputValidator = ajv.compile(_schema.PostUserOutput);
  const postAuthOutputValidator = ajv.compile(_schema.PostAuthOutput);
  const postConfirmationOutputValidator = ajv.compile(_schema.PostConfirmationOutput);
  const postRefreshOutputValidator = ajv.compile(_schema.PostRefreshOutput);
  const deleteUserOutputValidator = ajv.compile(_schema.DeleteUserOutput);

  const tokenStorageObject = new TokenStorageObject();

  const userService = {
    username: undefined,

    async createUser(postUserInput: PostUserInput) {
      console.log('@@ @@ begin createUser');
      //
      // *****
      // *****
      // ***** heads up, when running integ tests, everything runs on the laptop, ie where the aws config
      // ***** is. So, when running on the browser, there is no aws config. this is likely why react isn't working.
      // *****
      //
      // so really, i have two options:
      // 1. stand up a user service (uhhhh) that just acts as a way to already have the configs set up
      // 2. figure out a way to bundle the aws config file in the react app
      //
      // immediately, i am realizing that, once this react app is being served, it will get weird
      // while at that point, the user service that I am proposing in option 1 above is going to be
      // running on a docker container or a lambda or something. i think it will be easy for
      // that piece of compute to have an IAM role/user/whateva. So, i think option 1 is better (no brainer level better) in the long run
      //
      // Lastly, I think that, I can leave the user_facade as is. This means I don't have to rework the integ tests that use it
      //
      // *****
      const result = await (
        await fetch(`${baseUrl}/user`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...postUserInput,
          }),
        })
      ).json();

      if (!postUserOutputValidator(result)) {
        throw new Error(`UserService::postUser - invalid response: ${JSON.stringify(result)}`);
      }
    },

    async authorizeUser(postAuthInput: PostAuthInput) {
      console.log('@@ @@ begin authorizeUser');
      const result = await (
        await fetch(`${baseUrl}/auth`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...postAuthInput,
          }),
        })
      ).json();

      if (!postAuthOutputValidator(result)) {
        throw new Error(`UserService::postAuth - invalid response: ${JSON.stringify(result)}`);
      }

      const postAuthOutput = result as unknown as PostAuthOutput;
      console.log('@@ @@ authorizeUser setting access and refresh token');
      tokenStorageObject.setTokens(postAuthOutput.accessToken, postAuthOutput.refreshToken);
      await this.setUsername();
    },

    async confirmUser(postConfirmationInput: PostConfirmationInput) {
      console.log('@@ @@ begin confirmUser');
      const result = await (
        await fetch(`${baseUrl}/confirmation`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...postConfirmationInput,
          }),
        })
      ).json();

      if (!postConfirmationOutputValidator(result)) {
        throw new Error(
          `UserService::postConfirmation - invalid response: ${JSON.stringify(result)}`,
        );
      }
    },

    async refreshUser() {
      console.log('@@ @@ begin refreshUser');
      if (tokenStorageObject.getRefreshToken()) {
        const result = await (
          await fetch(`${baseUrl}/refresh`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refreshToken: tokenStorageObject.getRefreshToken(),
            }),
          })
        ).json();

        if (!postRefreshOutputValidator(result)) {
          throw new Error(`UserService::postRefresh - invalid response: ${JSON.stringify(result)}`);
        }

        const postRefreshOutput = result as unknown as PostRefreshOutput;
        console.log('@@ @@ refreshUser setting access and refresh tokens');
        tokenStorageObject.setTokens(postRefreshOutput.accessToken, postRefreshOutput.refreshToken);

        await this.setUsername();
      }
    },

    // TODO I think at this point, I am just worried about when a
    // call is done with an expired accesas token
    //
    // options:
    // 1) get 403, try to refresh token
    // 2) try to know when a token is in need of a refresh, and schedule it?
    // 3) try to refresh before any authenticaion of fetch happens
    //
    //
    // I think it would be good to take a step back
    //
    // on startup:
    //   load tokens from cookies
    //   immediately try to validate tokens
    //   if successful
    //     set username
    //   if immediately usuccessful
    //     a refresh is attempted
    //     if successful
    //       username is set
    //     else
    //       user is logged out, cookies are cleared

    async deleteUser() {
      console.log('@@ @@ begin deleteUser');
      if (tokenStorageObject.getAccessToken()) {
        const result = await (
          await fetch(`${baseUrl}/user`, {
            method: 'DELETE',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessToken: tokenStorageObject.getAccessToken(),
            }),
          })
        ).json();

        if (!deleteUserOutputValidator(result)) {
          throw new Error(`UserService::deleteUser - invalid response: ${JSON.stringify(result)}`);
        }

        this.logout();
      }
    },

    signedIn() {
      console.log('@@ @@ begin signedIn');
      return tokenStorageObject.loggedIn();
    },

    // do this in the backend?
    async setUsername() {
      console.log('@@ @@ begin setUsername');
      const accessToken = tokenStorageObject.getAccessToken();
      if (accessToken) {
        try {
          const decoded = await defaultVerifier.verify(accessToken);
          this.username = decoded.username;
        } catch (e: any) {
          await this.refreshUser();
        }
      }
    },

    getUsername() {
      //       if (!this.username && tokenStorageObject.loggedIn()) {
      //         this.setUsername();
      //       }
      return this.username;
    },

    logout() {
      console.log('@@ @@ begin logout');
      this.username = undefined;
      console.log('@@ @@ logout setting access and refresh token to undefined');
      tokenStorageObject.signOut();
    },
  } as UserServiceImpl;

  useEffect(() => {
    console.log('@@ @@ user_service useEffect');
    if (tokenStorageObject.loggedIn()) {
      userService.setUsername();
    }
  });

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
