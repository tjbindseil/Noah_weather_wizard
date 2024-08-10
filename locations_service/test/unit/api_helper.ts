import {
    DeletePicture,
    GetPictures,
    PostPicture,
    PostInvite,
    GetInvites,
    DeleteInvite,
} from '../../src/handlers';

export class DeletePicture_WithValidatedUserSetter extends DeletePicture {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class GetPictures_WithValidatedUserSetter extends GetPictures {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class PostPicture_WithValidatedUserSetter extends PostPicture {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class PostInvite_WithValidatedUserSetter extends PostInvite {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class GetInvites_WithValidatedUserSetter extends GetInvites {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class DeleteInvite_WithValidatedUserSetter extends DeleteInvite {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}
