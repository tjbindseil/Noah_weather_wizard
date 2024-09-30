const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
        Spot: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                polygonID: { type: 'string' },
            },
            required: ['id', 'latitude', 'longitude', 'name', 'polygonID'],
        },
        GetSpotsInput: {
            type: 'object',
            properties: {
                minLat: { type: 'string' },
                maxLat: { type: 'string' },
                minLong: { type: 'string' },
                maxLong: { type: 'string' },
            },
            required: ['maxLat', 'maxLong', 'minLat', 'minLong'],
        },
        GetSpotsOutput: {
            type: 'object',
            properties: {
                spots: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                            polygonID: { type: 'string' },
                        },
                        required: [
                            'id',
                            'latitude',
                            'longitude',
                            'name',
                            'polygonID',
                        ],
                    },
                },
            },
            required: ['spots'],
        },
        PostSpotInput: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' },
            },
            required: ['latitude', 'longitude', 'name'],
        },
        PostSpotOutput: {
            type: 'object',
            properties: {
                spot: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                        polygonID: { type: 'string' },
                    },
                    required: [
                        'id',
                        'latitude',
                        'longitude',
                        'name',
                        'polygonID',
                    ],
                },
            },
            required: ['spot'],
        },
        DeleteSpotInput: {
            type: 'object',
            properties: { id: { type: 'number' } },
            required: ['id'],
        },
        DeleteSpotOutput: { type: 'object' },
        ForecastHourly: {
            type: 'object',
            properties: { sunny_hourly: { type: 'boolean' } },
            required: ['sunny_hourly'],
        },
        Period: {
            type: 'object',
            properties: {
                number: { type: 'number' },
                name: { type: 'string' },
                startTime: { type: 'string' },
                endTime: { type: 'string' },
                isDaytime: { type: 'boolean' },
                temperature: { type: 'number' },
                temperatureUnit: { type: 'string' },
                temperatureTrend: { type: 'string' },
                probabilityOfPrecipitation: {
                    type: 'object',
                    properties: {
                        unitCode: { type: 'string' },
                        value: { type: ['null', 'number'] },
                    },
                    required: ['unitCode', 'value'],
                },
                windSpeed: { type: 'string' },
                windDirection: { type: 'string' },
                icon: { type: 'string' },
                shortForecast: { type: 'string' },
                detailedForecast: { type: 'string' },
            },
            required: [
                'detailedForecast',
                'endTime',
                'icon',
                'isDaytime',
                'name',
                'number',
                'probabilityOfPrecipitation',
                'shortForecast',
                'startTime',
                'temperature',
                'temperatureTrend',
                'temperatureUnit',
                'windDirection',
                'windSpeed',
            ],
        },
        Forecast: {
            type: 'object',
            properties: {
                units: { type: 'string' },
                elevation: {
                    type: 'object',
                    properties: {
                        unitCode: { type: 'string' },
                        value: { type: 'number' },
                    },
                    required: ['unitCode', 'value'],
                },
                periods: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            number: { type: 'number' },
                            name: { type: 'string' },
                            startTime: { type: 'string' },
                            endTime: { type: 'string' },
                            isDaytime: { type: 'boolean' },
                            temperature: { type: 'number' },
                            temperatureUnit: { type: 'string' },
                            temperatureTrend: { type: 'string' },
                            probabilityOfPrecipitation: {
                                type: 'object',
                                properties: {
                                    unitCode: { type: 'string' },
                                    value: { type: ['null', 'number'] },
                                },
                                required: ['unitCode', 'value'],
                            },
                            windSpeed: { type: 'string' },
                            windDirection: { type: 'string' },
                            icon: { type: 'string' },
                            shortForecast: { type: 'string' },
                            detailedForecast: { type: 'string' },
                        },
                        required: [
                            'detailedForecast',
                            'endTime',
                            'icon',
                            'isDaytime',
                            'name',
                            'number',
                            'probabilityOfPrecipitation',
                            'shortForecast',
                            'startTime',
                            'temperature',
                            'temperatureTrend',
                            'temperatureUnit',
                            'windDirection',
                            'windSpeed',
                        ],
                    },
                },
            },
            required: ['elevation', 'periods', 'units'],
        },
        GetForecastsInput: {
            type: 'object',
            properties: { spotIDs: { type: 'string' } },
            required: ['spotIDs'],
        },
        GetForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            units: { type: 'string' },
                            elevation: {
                                type: 'object',
                                properties: {
                                    unitCode: { type: 'string' },
                                    value: { type: 'number' },
                                },
                                required: ['unitCode', 'value'],
                            },
                            periods: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        number: { type: 'number' },
                                        name: { type: 'string' },
                                        startTime: { type: 'string' },
                                        endTime: { type: 'string' },
                                        isDaytime: { type: 'boolean' },
                                        temperature: { type: 'number' },
                                        temperatureUnit: { type: 'string' },
                                        temperatureTrend: { type: 'string' },
                                        probabilityOfPrecipitation: {
                                            type: 'object',
                                            properties: {
                                                unitCode: { type: 'string' },
                                                value: {
                                                    type: ['null', 'number'],
                                                },
                                            },
                                            required: ['unitCode', 'value'],
                                        },
                                        windSpeed: { type: 'string' },
                                        windDirection: { type: 'string' },
                                        icon: { type: 'string' },
                                        shortForecast: { type: 'string' },
                                        detailedForecast: { type: 'string' },
                                    },
                                    required: [
                                        'detailedForecast',
                                        'endTime',
                                        'icon',
                                        'isDaytime',
                                        'name',
                                        'number',
                                        'probabilityOfPrecipitation',
                                        'shortForecast',
                                        'startTime',
                                        'temperature',
                                        'temperatureTrend',
                                        'temperatureUnit',
                                        'windDirection',
                                        'windSpeed',
                                    ],
                                },
                            },
                        },
                        required: ['elevation', 'periods', 'units'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetPossibleForecastsInput: {
            type: 'object',
            properties: {
                spotIDs: { type: 'string' },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'spotIDs'],
        },
        GetPossibleForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            units: { type: 'string' },
                            elevation: {
                                type: 'object',
                                properties: {
                                    unitCode: { type: 'string' },
                                    value: { type: 'number' },
                                },
                                required: ['unitCode', 'value'],
                            },
                            periods: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        number: { type: 'number' },
                                        name: { type: 'string' },
                                        startTime: { type: 'string' },
                                        endTime: { type: 'string' },
                                        isDaytime: { type: 'boolean' },
                                        temperature: { type: 'number' },
                                        temperatureUnit: { type: 'string' },
                                        temperatureTrend: { type: 'string' },
                                        probabilityOfPrecipitation: {
                                            type: 'object',
                                            properties: {
                                                unitCode: { type: 'string' },
                                                value: {
                                                    type: ['null', 'number'],
                                                },
                                            },
                                            required: ['unitCode', 'value'],
                                        },
                                        windSpeed: { type: 'string' },
                                        windDirection: { type: 'string' },
                                        icon: { type: 'string' },
                                        shortForecast: { type: 'string' },
                                        detailedForecast: { type: 'string' },
                                    },
                                    required: [
                                        'detailedForecast',
                                        'endTime',
                                        'icon',
                                        'isDaytime',
                                        'name',
                                        'number',
                                        'probabilityOfPrecipitation',
                                        'shortForecast',
                                        'startTime',
                                        'temperature',
                                        'temperatureTrend',
                                        'temperatureUnit',
                                        'windDirection',
                                        'windSpeed',
                                    ],
                                },
                            },
                        },
                        required: ['elevation', 'periods', 'units'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetRankedForecastsInput: {
            type: 'object',
            properties: {
                spotIDs: { type: 'string' },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'spotIDs'],
        },
        GetRankedForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            units: { type: 'string' },
                            elevation: {
                                type: 'object',
                                properties: {
                                    unitCode: { type: 'string' },
                                    value: { type: 'number' },
                                },
                                required: ['unitCode', 'value'],
                            },
                            periods: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        number: { type: 'number' },
                                        name: { type: 'string' },
                                        startTime: { type: 'string' },
                                        endTime: { type: 'string' },
                                        isDaytime: { type: 'boolean' },
                                        temperature: { type: 'number' },
                                        temperatureUnit: { type: 'string' },
                                        temperatureTrend: { type: 'string' },
                                        probabilityOfPrecipitation: {
                                            type: 'object',
                                            properties: {
                                                unitCode: { type: 'string' },
                                                value: {
                                                    type: ['null', 'number'],
                                                },
                                            },
                                            required: ['unitCode', 'value'],
                                        },
                                        windSpeed: { type: 'string' },
                                        windDirection: { type: 'string' },
                                        icon: { type: 'string' },
                                        shortForecast: { type: 'string' },
                                        detailedForecast: { type: 'string' },
                                    },
                                    required: [
                                        'detailedForecast',
                                        'endTime',
                                        'icon',
                                        'isDaytime',
                                        'name',
                                        'number',
                                        'probabilityOfPrecipitation',
                                        'shortForecast',
                                        'startTime',
                                        'temperature',
                                        'temperatureTrend',
                                        'temperatureUnit',
                                        'windDirection',
                                        'windSpeed',
                                    ],
                                },
                            },
                        },
                        required: ['elevation', 'periods', 'units'],
                    },
                },
            },
            required: ['forecasts'],
        },
        GetForecastsHourlyInput: {
            type: 'object',
            properties: { spotIDs: { type: 'string' } },
            required: ['spotIDs'],
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
                spotIDs: { type: 'string' },
                criteriaID: { type: 'number' },
            },
            required: ['criteriaID', 'spotIDs'],
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
                spotIDs: { type: 'string' },
                formulaID: { type: 'number' },
            },
            required: ['formulaID', 'spotIDs'],
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
