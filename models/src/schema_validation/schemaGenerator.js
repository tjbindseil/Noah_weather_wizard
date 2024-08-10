// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const tjs = require('typescript-json-schema');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');

const settings = {
    required: true,
    ref: false,
};
const compilerOptions = {
    strictNullChecks: true,
};

const schema_validation_dir = './src/schema_validation/';

const program = tjs.getProgramFromFiles(
    [path.resolve(path.join(schema_validation_dir, 'schema_definition.ts'))],
    compilerOptions,
    './'
);

const schema = tjs.generateSchema(program, '*', settings);
fs.writeFileSync(
    path.join(schema_validation_dir, '_schema.ts'),
    'const schema = ' +
        JSON.stringify(schema) +
        ' as const;\nexport default schema.definitions;'
);
