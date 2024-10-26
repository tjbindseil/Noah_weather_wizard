import { User } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import * as userFacade from 'ww-3-user-facade-tjb';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserService {
  createUser(user: User): Promise<void>;
  authorizeUser(username: string, password: string): Promise<void>;
  confirmUser(username: string, confirmationCode: string): Promise<void>;
  refreshUser(): Promise<void>;
  deleteUser(token: string): Promise<void>;
  signedIn(): boolean;
  getUsername(): string | undefined;
}

export const UserServiceContext = Contextualizer.createContext(ProvidedServices.UserService);
export const useUserService = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

// so,
// its kinda a state machine
// not logged in
//   ^
//   |
//   v
// logged in

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface UserServiceImpl extends IUserService {
  authResult: AuthenticationResultType | undefined;
}

const UserService = ({ children }: any) => {
  const userService: UserServiceImpl = {
    authResult: undefined,
    async createUser(user: User) {
      await userFacade.createUser(user);

      // USERTODO navigate to confirmPage
    },

    async authorizeUser(username: string, password: string) {
      this.authResult = await userFacade.authorizeUser(username, password);
      // USERTODO navigate to a namable place (like favorites if thats where the user was trying to access)
      // or navigate to home if unspecified
    },

    async confirmUser(username: string, confirmationCode: string) {
      await userFacade.confirmUser(username, confirmationCode);
      // USERTODO navigate to login page
    },

    // TODO I think this is private...
    async refreshUser() {
      if (this.authResult) {
        if (this.authResult.RefreshToken) {
          this.authResult = await userFacade.refreshUser(this.authResult.RefreshToken);
        } else {
          // TODO some way to relay this back to the server
          console.error('somehow refresh token is not present on authResult');
        }
      }
    },

    async deleteUser(token: string) {
      await userFacade.deleteUser(token);
      // USERTODO navigate to a page that imdicates user was successfully deleted
    },

    signedIn() {
      return !(this.authResult === undefined);
    },

    getUsername() {
      return this.authResult?.AccessToken;
    },

    // TODO logout
    // i guess that is just clear the authResult
  };

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
