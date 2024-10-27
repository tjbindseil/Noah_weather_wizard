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
  accessToken: string | undefined;
  refreshToken: string | undefined;
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

  const userService = {
    accessToken: undefined,
    refreshToken: undefined,
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
      this.accessToken = postAuthOutput.accessToken;
      this.refreshToken = postAuthOutput.refreshToken;
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
      if (this.refreshToken) {
        const result = await (
          await fetch(`${baseUrl}/refresh`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refreshToken: this.refreshToken,
            }),
          })
        ).json();

        if (!postRefreshOutputValidator(result)) {
          throw new Error(`UserService::postRefresh - invalid response: ${JSON.stringify(result)}`);
        }

        const postRefreshOutput = result as unknown as PostRefreshOutput;
        console.log('@@ @@ refreshUser setting access and refresh tokens');
        this.accessToken = postRefreshOutput.accessToken;
        this.refreshToken = postRefreshOutput.refreshToken;

        await this.setUsername();
      }
    },

    async deleteUser() {
      console.log('@@ @@ begin deleteUser');
      if (this.accessToken) {
        const result = await (
          await fetch(`${baseUrl}/user`, {
            method: 'DELETE',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessToken: this.accessToken,
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
      // return !(this.accessToken || this.refreshToken);
      return !(this.accessToken === undefined);
    },

    async setUsername() {
      console.log('@@ @@ begin setUsername');
      if (this.accessToken) {
        const decoded = await defaultVerifier.verify(this.accessToken);
        this.username = decoded.username;
      }
    },

    getUsername() {
      return this.username;
    },

    logout() {
      console.log('@@ @@ begin logout');
      this.username = undefined;
      console.log('@@ @@ logout setting access and refresh token to undefined');
      this.accessToken = undefined;
      this.refreshToken = undefined;
    },
  } as UserServiceImpl;

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
