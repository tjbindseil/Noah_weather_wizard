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

export enum UserSignInStatus {
  LOGGED_IN,
  LOGGED_OUT,
  LOADING,
}

export interface IUserService {
  init(): Promise<void>;
  createUser(postUserInput: PostUserInput): Promise<void>;
  authorizeUser(postAuthInput: PostAuthInput): Promise<void>; // TODO rename to sign in
  confirmUser(postConfirmationInput: PostConfirmationInput): Promise<void>;
  deleteUser(): Promise<void>;
  getUserSignInStatus(): UserSignInStatus; // TODO change to logged in
  getUsername(): string | undefined;
  logout(): void;
  getAccessToken(): string;
}

export const UserServiceContext = Contextualizer.createContext(ProvidedServices.UserService);
export const useUserService = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

interface UserServiceImpl extends IUserService {
  refreshUser(): Promise<void>;
  username: string | undefined;
  verifyAccessToken: () => Promise<void>;
  userSignInStatus: UserSignInStatus;
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
    userSignInStatus: UserSignInStatus.LOADING,

    async createUser(postUserInput: PostUserInput) {
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
      tokenStorageObject.setTokens(postAuthOutput.accessToken, postAuthOutput.refreshToken);
      await this.verifyAccessToken();
    },

    async confirmUser(postConfirmationInput: PostConfirmationInput) {
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
        tokenStorageObject.setTokens(postRefreshOutput.accessToken, postRefreshOutput.refreshToken);

        await this.verifyAccessToken();
      }
    },

    async init() {
      if (this.userSignInStatus !== UserSignInStatus.LOADING) {
        return;
      }

      try {
        await this.verifyAccessToken();
      } catch (e: any) {
        // currently unable to detect what type of errors we are getting ...
        //
        // so assuming an expired token first
        //
        // TODO do this better
        try {
          await this.refreshUser();
        } catch (e: any) {
          this.logout();
        }
      }
    },

    async deleteUser() {
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

    getUserSignInStatus() {
      return this.userSignInStatus;
    },

    async verifyAccessToken() {
      const accessToken = tokenStorageObject.getAccessToken();
      if (accessToken) {
        const decoded = await defaultVerifier.verify(accessToken);
        this.username = decoded.username;
        this.userSignInStatus = UserSignInStatus.LOGGED_IN;
      } else {
        this.logout();
      }
    },

    getUsername() {
      return this.username;
    },

    logout() {
      this.username = undefined;
      tokenStorageObject.clearTokens();
      this.userSignInStatus = UserSignInStatus.LOGGED_OUT;
    },

    getAccessToken() {
      return tokenStorageObject.getAccessToken();
    },
  } as UserServiceImpl;

  useEffect(() => {
    userService.init();
  });

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
