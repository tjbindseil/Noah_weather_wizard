import { User } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import * as userFacade from 'ww-3-user-facade-tjb';

export interface IUserService {
  createUser(user: User): Promise<void>;
  authorizeUser(username: string, password: string): Promise<void>;
  confirmUser(username: string, confirmationCode: string): Promise<void>;
  refreshUser(refreshToken: string): Promise<void>;
  deleteUser(token: string): Promise<void>;
}

export const UserServiceContext = Contextualizer.createContext(ProvidedServices.UserService);
export const useUserService = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const UserService = ({ children }: any) => {
  const userService = {
    async createUser(user: User) {
      await userFacade.createUser(user);
    },

    async authorizeUser(username: string, password: string) {
      const authResultGetTokenFromHere = await userFacade.authorizeUser(username, password);
      authResultGetTokenFromHere;
    },
    //   confirmUser(username: string, confirmationCode: string): Promise<void>;
    //   refreshUser(refreshToken: string): Promise<void>;
    //   deleteUser(token: string): Promise<void>;
    //
  };

  return (
    <>
      <UserServiceContext.Provider value={userService}>{children}</UserServiceContext.Provider>
    </>
  );
};

export default UserService;
