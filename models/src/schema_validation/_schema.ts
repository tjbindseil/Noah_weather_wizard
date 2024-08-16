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
        LatLong: {
            type: 'object',
            properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
            },
            required: ['latitude', 'longitude'],
        },
        GetForecastsInput: {
            type: 'object',
            properties: {
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
            },
            required: ['points'],
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
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'points'],
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
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'points'],
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
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
            },
            required: ['points'],
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
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'points'],
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
                points: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                        },
                        required: ['latitude', 'longitude'],
                    },
                },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'points'],
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
