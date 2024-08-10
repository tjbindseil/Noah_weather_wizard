import {
    DeleteInviteInput,
    DeleteInviteOutput,
    _schema,
} from 'dwf-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'dwf-3-api-tjb';
import { deleteInvite, selectPicture } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class DeleteInvite extends StrictlyAuthenticatedAPI<
    DeleteInviteInput,
    DeleteInviteOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeleteInviteInput);
    }

    public async process(
        input: DeleteInviteInput,
        pgClient: Client
    ): Promise<DeleteInviteOutput> {
        // make sure this user owns the picture
        const picture = await selectPicture(pgClient, input.pictureId);
        if (picture.createdBy !== this.validatedUsername) {
            throw new APIError(
                403,
                'can only delete invites for pictures you have created'
            );
        }
        await deleteInvite(pgClient, input.pictureId, input.invitee);

        return {};
    }
}
