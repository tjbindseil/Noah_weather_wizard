const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        GetLocationsInput: { type: 'object' },
        GetLocationsOutput: {
            type: 'object',
            properties: {
                locations: {
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
            required: ['locations'],
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
                location_TODO_CHANGE: {
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
            required: ['location_TODO_CHANGE'],
        },
        DeleteLocationInput: {
            type: 'object',
            properties: { id: { type: 'number' } },
            required: ['id'],
        },
        DeleteLocationOutput: { type: 'object' },
    },
} as const;
export default schema.definitions;
