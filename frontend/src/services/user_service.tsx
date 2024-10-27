import { User } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import * as userFacade from 'ww-3-user-facade-tjb';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { defaultVerifier } from 'ww-3-api-tjb';

export interface IUserService {
  createUser(user: User): Promise<void>;
  authorizeUser(username: string, password: string): Promise<void>;
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
  authResult: AuthenticationResultType | undefined;
  refreshUser(): Promise<void>;
  username: string | undefined;
  setUsername: () => Promise<void>;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const UserService = ({ children }: any) => {
  const userService = {
    authResult: undefined,
    username: undefined,

    async createUser(user: User) {
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
      await userFacade.createUser(user);
    },

    async authorizeUser(username: string, password: string) {
      this.authResult = await userFacade.authorizeUser(username, password);
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
