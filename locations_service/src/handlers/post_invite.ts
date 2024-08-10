import { PostInviteInput, PostInviteOutput, _schema } from 'dwf-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'dwf-3-api-tjb';
import { postInvite, selectPicture } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import {
    AdminGetUserCommand,
    CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export class PostInvite extends StrictlyAuthenticatedAPI<
    PostInviteInput,
    PostInviteOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostInviteInput);
    }

    constructor(private readonly client: CognitoIdentityProviderClient) {
        super();
    }

    public async process(
        input: PostInviteInput,
        pgClient: Client
    ): Promise<PostInviteOutput> {
        // ensure invitee is a real user
        const command = new AdminGetUserCommand({
            Username: input.invitee,
            UserPoolId: 'us-east-1_zpq5v4Bda',
        });
        await this.client.send(command);
        // TODO make sure that it throws if the user doesn't exist

        const picture = await selectPicture(pgClient, input.pictureId);
        if (picture.createdBy !== this.validatedUsername) {
            throw new APIError(
                403,
                'can only invite to pictures you have created'
            );
        }

        await postInvite(
            pgClient,
            input.pictureId,
            input.invitee,
            input.writeAccess
        );

        return {};
    }
}
