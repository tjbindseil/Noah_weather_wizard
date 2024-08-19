import { GetSpots, PostSpot, DeleteSpot } from '../../src/handlers';

export class GetSpots_WithValidatedUserSetter extends GetSpots {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class PostSpot_WithValidatedUserSetter extends PostSpot {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}

export class DeleteSpot_WithValidatedUserSetter extends DeleteSpot {
    public setValidatedUsername(validatedUsername: string) {
        this.validatedUsername = validatedUsername;
    }
}
