import { PostAuthInput, PostAuthOutput, _schema } from 'ww-3-models-tjb';
import { APIError, LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { authorizeUser } from 'ww-3-user-facade-tjb';

export class PostAuth extends LooselyAuthenticatedAPI<
    PostAuthInput,
    PostAuthOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostAuthInput);
    }

    public async process(
        input: PostAuthInput,
        _unused: unknown
    ): Promise<PostAuthOutput> {
        const authResult = await authorizeUser(input.username, input.password);

        if (!authResult.AccessToken) {
            throw new APIError(500, 'authResult does not contain accessToken');
        }
        if (!authResult.RefreshToken) {
            throw new APIError(500, 'authResult does not contain refreshToken');
        }

        return {
            accessToken: authResult.AccessToken,
            refreshToken: authResult.RefreshToken,
        };
    }
}
