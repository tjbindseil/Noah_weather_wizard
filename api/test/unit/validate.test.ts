import { validate } from '../../src/validate';
import { _schema, PostSpotInput } from 'ww-3-models-tjb';

describe('validate tests', () => {
    const validPostSpotInput: PostSpotInput = {
        name: 'n',
        latitude: 420,
        longitude: 69,
    };
    const invalidPostSpotInput = {};

    it('validates when valid', () => {
        const postSpotInput = validate(
            _schema.PostSpotInput,
            validPostSpotInput
        );
        expect(postSpotInput).toEqual(validPostSpotInput);
    });

    it('throws an error when not valid', async () => {
        expect(() =>
            validate(_schema.PostSpotInput, invalidPostSpotInput)
        ).toThrow(
            new Error(`obj: ${JSON.stringify(invalidPostSpotInput)} is invalid`)
        );
    });
});
