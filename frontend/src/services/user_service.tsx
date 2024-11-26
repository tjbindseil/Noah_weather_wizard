import {
  DeleteUserInput,
  DeleteUserOutput,
  PostAuthInput,
  PostAuthOutput,
  PostConfirmationInput,
  PostConfirmationOutput,
  PostNewConfirmationCodeInput,
  PostNewConfirmationCodeOutput,
  PostRefreshInput,
  PostRefreshOutput,
  PostUserInput,
  PostUserOutput,
  _schema,
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { defaultVerifier } from 'ww-3-api-tjb';
import { TokenStorageObject } from './utils/token_storage_obj';
import { useEffect } from 'react';
import { fetchWithError, HTTPMethod } from './fetch_wrapper';
import { baseUrl } from '.';

export enum UserSignInStatus {
  LOGGED_IN,
  LOGGED_OUT,
  LOADING,
}

export interface IUserService {
  init(): Promise<void>;
  createUser(input: PostUserInput): Promise<PostUserOutput>;
  authorizeUser(input: PostAuthInput): Promise<void>;
  confirmUser(input: PostConfirmationInput): Promise<void>;
  deleteUser(): Promise<void>;
  getUserSignInStatus(): UserSignInStatus;
  getUsername(): string | undefined;
  logout(): void;
  getAccessToken(): Promise<string>;
  getNewRefreshCode: (
    input: PostNewConfirmationCodeInput,
  ) => Promise<PostNewConfirmationCodeOutput>;
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

/* eslint-disable  @typescript-eslint/no-explicit-any */
const UserService = ({ children }: any) => {
  const tokenStorageObject = new TokenStorageObject();

  const userService = {
    username: undefined,
    userSignInStatus: UserSignInStatus.LOADING,

    async createUser(input: PostUserInput) {
      return await fetchWithError<PostUserInput, PostUserOutput>(
        input,
        `${baseUrl}/user`,
        HTTPMethod.POST,
        _schema.PostUserOutput,
      );
    },

    async authorizeUser(input: PostAuthInput) {
      const postAuthOutput = await fetchWithError<PostAuthInput, PostAuthOutput>(
        input,
        `${baseUrl}/auth`,
        HTTPMethod.POST,
        _schema.PostAuthOutput,
      );
      tokenStorageObject.setTokens(postAuthOutput.accessToken, postAuthOutput.refreshToken);
      await this.verifyAccessToken();
    },

    async confirmUser(input: PostConfirmationInput) {
      await fetchWithError<PostConfirmationInput, PostConfirmationOutput>(
        input,
        `${baseUrl}/confirmation`,
        HTTPMethod.POST,
        _schema.PostConfirmationOutput,
      );
    },

    async refreshUser() {
      const refreshToken = tokenStorageObject.getRefreshToken();
      if (refreshToken) {
        const postRefreshOutput = await fetchWithError<PostRefreshInput, PostRefreshOutput>(
          {
            refreshToken,
          },
          `${baseUrl}/refresh`,
          HTTPMethod.POST,
          _schema.PostRefreshOutput,
        );

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
      const accessToken = tokenStorageObject.getAccessToken();
      if (accessToken) {
        await fetchWithError<DeleteUserInput, DeleteUserOutput>(
          {
            accessToken,
          },
          `${baseUrl}/user`,
          HTTPMethod.DELETE,
          _schema.DeleteUserOutput,
        );
      }

      this.logout();
    },

    getUserSignInStatus() {
      return this.userSignInStatus;
    },

    // TODO apparently this is not a best practice
    // I asked chatgpt and it said that the token could be tampered with or stolen
    // or the authentication code could be modified
    // I don't think tampered with is an issue because any
    // authenticated routes are checked on the backend as well, this is just a way
    // to reduce requests that would fail due to expired tokens
    // for now, I'm adding a dep (npm install jsonwebtoken) here to make it work in the browser even though its 'not advised'
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

    async getAccessToken() {
      // TODO - this try catch try catch is repeated
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
      return tokenStorageObject.getAccessToken();
    },

    async getNewRefreshCode(input: PostNewConfirmationCodeInput) {
      await (
        await fetch(`${baseUrl}/new-confirmation-code`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...input,
          }),
        })
      ).json();

      return {};
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
