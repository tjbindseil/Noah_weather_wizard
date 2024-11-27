import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const USERNAME_KEY = 'USERNAME_KEY';

export class TokenStorageObject {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private username: string | undefined;

  constructor() {
    // attempt to load the cookies right off the bat, if they're not there, assume nobody is logged in
    this.accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    this.refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    this.username = Cookies.get(USERNAME_KEY);
  }

  // TODO determine expiration time
  public setTokens(accessToken: string, refreshToken?: string, username?: string) {
    this.accessToken = accessToken;
    Cookies.set(ACCESS_TOKEN_KEY, this.accessToken, { secure: true });

    if (refreshToken) {
      this.refreshToken = refreshToken;
      Cookies.set(REFRESH_TOKEN_KEY, this.refreshToken, { secure: true });
    }

    if (username) {
      this.username = username;
      Cookies.set(USERNAME_KEY, this.username, { secure: true });
    }
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public getRefreshToken() {
    return this.refreshToken;
  }

  public getUsername() {
    return this.username;
  }

  public clearTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    this.username = undefined;
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USERNAME_KEY);
  }
}
