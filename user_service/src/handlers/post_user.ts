import { PostUserInput, PostUserOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { createUser } from 'ww-3-user-facade-tjb';

export class PostUser extends LooselyAuthenticatedAPI<
    PostUserInput,
    PostUserOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostUserInput);
    }

    public async process(
        input: PostUserInput,
        _unused: unknown
    ): Promise<PostUserOutput> {
        await createUser(input.user);

        return {};
    }
}
