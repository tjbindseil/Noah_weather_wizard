import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

export class TokenStorageObject {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;

  constructor() {
    // attempt to load the cookies right off the bat, if they're not there, assume nobody is logged in
    this.accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    this.refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    // TODO
    // we need to set the username here
    // but,
    // that is an asynchronous operation
    //
    // so, I need to either:
    // 1. bite the bullet and handle loading
    // 2. find a way to do it during start up
  }

  // TODO determine expiration time
  public setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    Cookies.set(ACCESS_TOKEN_KEY, this.accessToken, { secure: true });

    if (refreshToken) {
      this.refreshToken = refreshToken;
      Cookies.set(REFRESH_TOKEN_KEY, this.refreshToken, { secure: true });
    }
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public getRefreshToken() {
    return this.refreshToken;
  }

  // TODO this is not really accurate, could have issues refreshing
  public loggedIn() {
    return this.accessToken !== undefined && this.refreshToken !== undefined;
  }

  public signOut() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }
}
