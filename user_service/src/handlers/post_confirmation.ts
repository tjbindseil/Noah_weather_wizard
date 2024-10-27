import {
    PostConfirmationInput,
    PostConfirmationOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { confirmUser } from 'ww-3-user-facade-tjb';

export class PostConfirmation extends LooselyAuthenticatedAPI<
    PostConfirmationInput,
    PostConfirmationOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostConfirmationInput);
    }

    public async process(
        input: PostConfirmationInput,
        _unused: unknown
    ): Promise<PostConfirmationOutput> {
        await confirmUser(input.username, input.confirmationCode);

        return {};
    }
}
