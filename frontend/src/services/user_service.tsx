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
  getAccessToken(): string;
  getNewConfirmationCode: (
    input: PostNewConfirmationCodeInput,
  ) => Promise<PostNewConfirmationCodeOutput>;
  refreshUser(): Promise<void>;
}

export const UserServiceContext = Contextualizer.createContext(ProvidedServices.UserService);
export const useUserService = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

interface UserServiceImpl extends IUserService {
  username: string | undefined;
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
      tokenStorageObject.setTokens(
        postAuthOutput.accessToken,
        postAuthOutput.refreshToken,
        input.username,
      );

      this.username = input.username;
      this.userSignInStatus = UserSignInStatus.LOGGED_IN;
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

        this.username = tokenStorageObject.getUsername();
        this.userSignInStatus = UserSignInStatus.LOGGED_IN;
      }
    },

    async init() {
      if (this.userSignInStatus !== UserSignInStatus.LOADING) {
        return;
      }

      try {
        console.log('user service, refershing user in init');
        await this.refreshUser();
      } catch (e: any) {
        console.log('user service, logging user out in init');
        this.logout();
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

    async getNewConfirmationCode(input: PostNewConfirmationCodeInput) {
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

// ok, so we can't verify the token on the browser
// so, the ideal is,
//
// initially, no token in cookies
// user logs in, gets token stores token
// user makes other requests to backend and includes token in those requests
// backend will do one of three things:
// 1. handle the request when the token is valid
// 2. return http 5something code to indicate expired token
// 3. return http 5somethingelse code to indicate that the token is invalid
//
// no, the backend refreshes!!!
// the only thing here is that the token would have to be returned
