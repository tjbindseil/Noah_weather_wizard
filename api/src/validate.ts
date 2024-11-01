import Ajv from 'ajv';

const ajv = new Ajv();

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function validate<T>(schema: any, obj: any): T {
    const validator = ajv.compile(schema);
    if (!validator(obj)) {
        throw new Error(`obj: ${JSON.stringify(obj)} is invalid`);
    }
    return obj as T;
}
