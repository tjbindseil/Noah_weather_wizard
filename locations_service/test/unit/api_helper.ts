import { GetLocations, PostLocation, DeleteLocation } from '../../src/handlers';

export class GetLocations_WithValidatedUserSetter extends GetLocations {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class PostLocation_WithValidatedUserSetter extends PostLocation {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class DeleteLocation_WithValidatedUserSetter extends DeleteLocation {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}
