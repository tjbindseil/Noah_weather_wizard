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
        Forecast: {
            type: 'object',
            properties: { sunny: { type: 'boolean' } },
            required: ['sunny'],
        },
        ForecastHourly: {
            type: 'object',
            properties: { sunny_hourly: { type: 'boolean' } },
            required: ['sunny_hourly'],
        },
        GetForecastsInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
            },
            required: ['pointIDs'],
        },
        GetForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny: { type: 'boolean' } },
                        required: ['sunny'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetPossibleForecastsInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'pointIDs'],
        },
        GetPossibleForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny: { type: 'boolean' } },
                        required: ['sunny'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetRankedForecastsInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'pointIDs'],
        },
        GetRankedForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny: { type: 'boolean' } },
                        required: ['sunny'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetForecastsHourlyInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
            },
            required: ['pointIDs'],
        },
        GetForecastsHourlyOutput: {
            type: 'object',
            properties: {
                forecastsHourly: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny_hourly: { type: 'boolean' } },
                        required: ['sunny_hourly'],
                    },
                },
            },
            required: ['forecastsHourly'],
        },
        GetPossibleForecastsHourlyInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'pointIDs'],
        },
        GetPossibleForecastsHourlyOutput: {
            type: 'object',
            properties: {
                forecastsHourly: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny_hourly: { type: 'boolean' } },
                        required: ['sunny_hourly'],
                    },
                },
            },
            required: ['forecastsHourly'],
        },
        GetRankedForecastsHourlyInput: {
            type: 'object',
            properties: {
                pointIDs: { type: 'array', items: { type: 'number' } },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'pointIDs'],
        },
        GetRankedForecastsHourlyOutput: {
            type: 'object',
            properties: {
                forecastsHourly: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: { sunny_hourly: { type: 'boolean' } },
                        required: ['sunny_hourly'],
                    },
                },
            },
            required: ['forecastsHourly'],
        },
    },
} as const;
export default schema.definitions;
