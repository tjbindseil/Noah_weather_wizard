import Cookies from 'js-cookie';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

export class TokenStorageObject {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public getRefreshToken() {
    return this.refreshToken;
  }

  public loggedIn() {
    return this.accessToken !== undefined && this.refreshToken !== undefined;
  }

  public signOut() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }
}
