const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        GetLocationsInput: { type: 'object' },
        GetLocationsOutput: {
            type: 'object',
            properties: {
                Locations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['id', 'latitude', 'longitude', 'name'],
                    },
                },
            },
            required: ['Locations'],
        },
        PostLocationInput: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
            },
            required: ['latitude', 'longitude', 'name'],
        },
        PostLocationOutput: {
            type: 'object',
            properties: {
                location: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                    },
                    required: ['id', 'latitude', 'longitude', 'name'],
                },
            },
            required: ['location'],
        },
    },
} as const;
export default schema.definitions;
