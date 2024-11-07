import {
    PostNewConfirmationCodeInput,
    PostNewConfirmationCodeOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { getNewRefreshCode } from 'ww-3-user-facade-tjb/build/user_facade';

export class PostNewConfirmationCode extends LooselyAuthenticatedAPI<
    PostNewConfirmationCodeInput,
    PostNewConfirmationCodeOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostNewConfirmationCodeInput);
    }

    public async process(
        input: PostNewConfirmationCodeInput,
        _unused: unknown
    ): Promise<PostNewConfirmationCodeOutput> {
        await getNewRefreshCode(input.username);

        return {};
    }
}
