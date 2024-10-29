export interface PostRefreshInput {
    refreshToken: string;
}

export interface PostRefreshOutput {
    accessToken: string;
    refreshToken?: string;
}
