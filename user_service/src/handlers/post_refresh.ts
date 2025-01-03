import { PostRefreshInput, PostRefreshOutput, _schema } from 'ww-3-models-tjb';
import { APIError, LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { refreshUser } from 'ww-3-user-facade-tjb';

export class PostRefresh extends LooselyAuthenticatedAPI<
    PostRefreshInput,
    PostRefreshOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostRefreshInput);
    }

    public async process(
        input: PostRefreshInput,
        _unused: unknown
    ): Promise<PostRefreshOutput> {
        const authResult = await refreshUser(input.refreshToken);

        if (!authResult.AccessToken) {
            throw new APIError(500, 'authResult does not contain accessToken');
        }

        return {
            accessToken: authResult.AccessToken,
            refreshToken: authResult.RefreshToken,
        };
    }
}
