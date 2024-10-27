import { PostAuthInput, PostAuthOutput, PostUserInput, _schema } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { defaultVerifier } from 'ww-3-api-tjb';
import Ajv from 'ajv';

export interface IUserService {
  createUser(postUserInput: PostUserInput): Promise<void>;
  authorizeUser(postAuthInput: PostAuthInput): Promise<void>;
  confirmUser(username: string, confirmationCode: string): Promise<void>;
  deleteUser(token: string): Promise<void>;
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
    authResult: undefined,
    username: undefined,

    async createUser(postUserInput: PostUserInput) {
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
      this.accessToken = postAuthOutput.accessToken;
      await this.setUsername();
    },

    async confirmUser(username: string, confirmationCode: string) {
      await userFacade.confirmUser(username, confirmationCode);
    },

    async refreshUser() {
      if (this.authResult) {
        if (this.authResult.RefreshToken) {
          this.authResult = await userFacade.refreshUser(this.authResult.RefreshToken);
        } else {
          // TODO some way to relay this back to the server
          console.error('somehow refresh token is not present on authResult');
        }
      }
      await this.setUsername();
    },

    async deleteUser(token: string) {
      await userFacade.deleteUser(token);
    },

    signedIn() {
      return !(this.authResult === undefined);
    },

    async setUsername() {
      if (this.authResult && this.authResult.AccessToken) {
        const decoded = await defaultVerifier.verify(this.authResult.AccessToken);
        this.username = decoded.username;
      }
    },

    getUsername() {
      return this.username;
    },

    logout() {
      this.username = undefined;
      this.authResult = undefined;
    },
  } as UserServiceImpl;

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
