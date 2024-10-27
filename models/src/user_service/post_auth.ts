export interface PostAuthInput {
    username: string;
    password: string;
}

export interface PostAuthOutput {
    accessToken: string;
    refreshToken: string;
}
