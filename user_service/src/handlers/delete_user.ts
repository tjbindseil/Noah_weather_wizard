import { DeleteUserInput, DeleteUserOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { deleteUser } from 'ww-3-user-facade-tjb';

export class DeleteUser extends LooselyAuthenticatedAPI<
    DeleteUserInput,
    DeleteUserOutput,
    unknown
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeleteUserInput);
    }

    public async process(
        input: DeleteUserInput,
        _unused: unknown
    ): Promise<DeleteUserOutput> {
        await deleteUser(input.accessToken);

        return {};
    }
}
