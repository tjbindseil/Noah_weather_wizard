import { GetInvitesInput, GetInvitesOutput, _schema } from 'dwf-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'dwf-3-api-tjb';
import {
    getInvitesByInvitee,
    getInvitesByPictureId,
    selectPicture,
} from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetInvites extends StrictlyAuthenticatedAPI<
    GetInvitesInput,
    GetInvitesOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetInvitesInput);
    }

    public async process(
        input: GetInvitesInput,
        pgClient: Client
    ): Promise<GetInvitesOutput> {
        if (input.pictureId) {
            const pictureIdAsNumber: number = +input.pictureId;
            // make sure this user owns the picture
            const picture = await selectPicture(pgClient, pictureIdAsNumber);
            if (picture.createdBy !== this.validatedUsername) {
                throw new APIError(
                    403,
                    'can only check invites by pictureId for pictures you have created'
                );
            }

            return {
                invites: await getInvitesByPictureId(
                    pgClient,
                    pictureIdAsNumber
                ),
            };
        } else {
            return {
                invites: await getInvitesByInvitee(
                    pgClient,
                    this.validatedUsername
                ),
            };
        }
    }
}
