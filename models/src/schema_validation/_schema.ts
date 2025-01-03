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
                gridX: { type: 'number' },
                gridY: { type: 'number' },
                creator: { type: 'string' },
            },
            required: [
                'creator',
                'gridX',
                'gridY',
                'id',
                'latitude',
                'longitude',
                'name',
                'polygonID',
            ],
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
                            gridX: { type: 'number' },
                            gridY: { type: 'number' },
                            creator: { type: 'string' },
                        },
                        required: [
                            'creator',
                            'gridX',
                            'gridY',
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
                        gridX: { type: 'number' },
                        gridY: { type: 'number' },
                        creator: { type: 'string' },
                    },
                    required: [
                        'creator',
                        'gridX',
                        'gridY',
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
                            relativeHumidity: {
                                anyOf: [
                                    {
                                        type: 'object',
                                        properties: {
                                            unitCode: { type: 'string' },
                                            value: { type: ['null', 'number'] },
                                        },
                                        required: ['unitCode', 'value'],
                                    },
                                    { type: 'null' },
                                ],
                            },
                            windSpeed: { type: ['null', 'string'] },
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
                            'relativeHumidity',
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
                generatedAt: { type: 'string' },
                updateTime: { type: 'string' },
            },
            required: [
                'elevation',
                'generatedAt',
                'periods',
                'units',
                'updateTime',
            ],
        },
        HourlyPeriod: {
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
                relativeHumidity: {
                    anyOf: [
                        {
                            type: 'object',
                            properties: {
                                unitCode: { type: 'string' },
                                value: { type: ['null', 'number'] },
                            },
                            required: ['unitCode', 'value'],
                        },
                        { type: 'null' },
                    ],
                },
                windSpeed: { type: ['null', 'string'] },
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
                'relativeHumidity',
                'shortForecast',
                'startTime',
                'temperature',
                'temperatureTrend',
                'temperatureUnit',
                'windDirection',
                'windSpeed',
            ],
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
                windSpeed: { type: ['null', 'string'] },
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
                            windSpeed: { type: ['null', 'string'] },
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
                generatedAt: { type: 'string' },
                updateTime: { type: 'string' },
            },
            required: [
                'elevation',
                'generatedAt',
                'periods',
                'units',
                'updateTime',
            ],
        },
        GetForecastsInput: {
            type: 'object',
            properties: { spotIDs: { type: 'string' } },
            required: ['spotIDs'],
        },
        SpotToForecast: {
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
                        gridX: { type: 'number' },
                        gridY: { type: 'number' },
                        creator: { type: 'string' },
                    },
                    required: [
                        'creator',
                        'gridX',
                        'gridY',
                        'id',
                        'latitude',
                        'longitude',
                        'name',
                        'polygonID',
                    ],
                },
                forecast: {
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
                                    windSpeed: { type: ['null', 'string'] },
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
                        generatedAt: { type: 'string' },
                        updateTime: { type: 'string' },
                    },
                    required: [
                        'elevation',
                        'generatedAt',
                        'periods',
                        'units',
                        'updateTime',
                    ],
                },
            },
            required: ['forecast', 'spot'],
        },
        GetForecastsOutput: {
            type: 'object',
            properties: {
                forecasts: {
                    type: 'array',
                    items: {
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
                                    gridX: { type: 'number' },
                                    gridY: { type: 'number' },
                                    creator: { type: 'string' },
                                },
                                required: [
                                    'creator',
                                    'gridX',
                                    'gridY',
                                    'id',
                                    'latitude',
                                    'longitude',
                                    'name',
                                    'polygonID',
                                ],
                            },
                            forecast: {
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
                                                temperatureUnit: {
                                                    type: 'string',
                                                },
                                                temperatureTrend: {
                                                    type: 'string',
                                                },
                                                probabilityOfPrecipitation: {
                                                    type: 'object',
                                                    properties: {
                                                        unitCode: {
                                                            type: 'string',
                                                        },
                                                        value: {
                                                            type: [
                                                                'null',
                                                                'number',
                                                            ],
                                                        },
                                                    },
                                                    required: [
                                                        'unitCode',
                                                        'value',
                                                    ],
                                                },
                                                windSpeed: {
                                                    type: ['null', 'string'],
                                                },
                                                windDirection: {
                                                    type: 'string',
                                                },
                                                icon: { type: 'string' },
                                                shortForecast: {
                                                    type: 'string',
                                                },
                                                detailedForecast: {
                                                    type: 'string',
                                                },
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
                                    generatedAt: { type: 'string' },
                                    updateTime: { type: 'string' },
                                },
                                required: [
                                    'elevation',
                                    'generatedAt',
                                    'periods',
                                    'units',
                                    'updateTime',
                                ],
                            },
                        },
                        required: ['forecast', 'spot'],
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
                                        windSpeed: { type: ['null', 'string'] },
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
                            generatedAt: { type: 'string' },
                            updateTime: { type: 'string' },
                        },
                        required: [
                            'elevation',
                            'generatedAt',
                            'periods',
                            'units',
                            'updateTime',
                        ],
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
                                        windSpeed: { type: ['null', 'string'] },
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
                            generatedAt: { type: 'string' },
                            updateTime: { type: 'string' },
                        },
                        required: [
                            'elevation',
                            'generatedAt',
                            'periods',
                            'units',
                            'updateTime',
                        ],
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
        SpotToForecastHourly: {
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
                        gridX: { type: 'number' },
                        gridY: { type: 'number' },
                        creator: { type: 'string' },
                    },
                    required: [
                        'creator',
                        'gridX',
                        'gridY',
                        'id',
                        'latitude',
                        'longitude',
                        'name',
                        'polygonID',
                    ],
                },
                forecastHourly: {
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
                                    relativeHumidity: {
                                        anyOf: [
                                            {
                                                type: 'object',
                                                properties: {
                                                    unitCode: {
                                                        type: 'string',
                                                    },
                                                    value: {
                                                        type: [
                                                            'null',
                                                            'number',
                                                        ],
                                                    },
                                                },
                                                required: ['unitCode', 'value'],
                                            },
                                            { type: 'null' },
                                        ],
                                    },
                                    windSpeed: { type: ['null', 'string'] },
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
                                    'relativeHumidity',
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
                        generatedAt: { type: 'string' },
                        updateTime: { type: 'string' },
                    },
                    required: [
                        'elevation',
                        'generatedAt',
                        'periods',
                        'units',
                        'updateTime',
                    ],
                },
            },
            required: ['forecastHourly', 'spot'],
        },
        GetForecastsHourlyOutput: {
            type: 'object',
            properties: {
                forecastsHourly: {
                    type: 'array',
                    items: {
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
                                    gridX: { type: 'number' },
                                    gridY: { type: 'number' },
                                    creator: { type: 'string' },
                                },
                                required: [
                                    'creator',
                                    'gridX',
                                    'gridY',
                                    'id',
                                    'latitude',
                                    'longitude',
                                    'name',
                                    'polygonID',
                                ],
                            },
                            forecastHourly: {
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
                                                temperatureUnit: {
                                                    type: 'string',
                                                },
                                                temperatureTrend: {
                                                    type: 'string',
                                                },
                                                probabilityOfPrecipitation: {
                                                    type: 'object',
                                                    properties: {
                                                        unitCode: {
                                                            type: 'string',
                                                        },
                                                        value: {
                                                            type: [
                                                                'null',
                                                                'number',
                                                            ],
                                                        },
                                                    },
                                                    required: [
                                                        'unitCode',
                                                        'value',
                                                    ],
                                                },
                                                relativeHumidity: {
                                                    anyOf: [
                                                        {
                                                            type: 'object',
                                                            properties: {
                                                                unitCode: {
                                                                    type: 'string',
                                                                },
                                                                value: {
                                                                    type: [
                                                                        'null',
                                                                        'number',
                                                                    ],
                                                                },
                                                            },
                                                            required: [
                                                                'unitCode',
                                                                'value',
                                                            ],
                                                        },
                                                        { type: 'null' },
                                                    ],
                                                },
                                                windSpeed: {
                                                    type: ['null', 'string'],
                                                },
                                                windDirection: {
                                                    type: 'string',
                                                },
                                                icon: { type: 'string' },
                                                shortForecast: {
                                                    type: 'string',
                                                },
                                                detailedForecast: {
                                                    type: 'string',
                                                },
                                            },
                                            required: [
                                                'detailedForecast',
                                                'endTime',
                                                'icon',
                                                'isDaytime',
                                                'name',
                                                'number',
                                                'probabilityOfPrecipitation',
                                                'relativeHumidity',
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
                                    generatedAt: { type: 'string' },
                                    updateTime: { type: 'string' },
                                },
                                required: [
                                    'elevation',
                                    'generatedAt',
                                    'periods',
                                    'units',
                                    'updateTime',
                                ],
                            },
                        },
                        required: ['forecastHourly', 'spot'],
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
                                        relativeHumidity: {
                                            anyOf: [
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        unitCode: {
                                                            type: 'string',
                                                        },
                                                        value: {
                                                            type: [
                                                                'null',
                                                                'number',
                                                            ],
                                                        },
                                                    },
                                                    required: [
                                                        'unitCode',
                                                        'value',
                                                    ],
                                                },
                                                { type: 'null' },
                                            ],
                                        },
                                        windSpeed: { type: ['null', 'string'] },
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
                                        'relativeHumidity',
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
                            generatedAt: { type: 'string' },
                            updateTime: { type: 'string' },
                        },
                        required: [
                            'elevation',
                            'generatedAt',
                            'periods',
                            'units',
                            'updateTime',
                        ],
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
                                        relativeHumidity: {
                                            anyOf: [
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        unitCode: {
                                                            type: 'string',
                                                        },
                                                        value: {
                                                            type: [
                                                                'null',
                                                                'number',
                                                            ],
                                                        },
                                                    },
                                                    required: [
                                                        'unitCode',
                                                        'value',
                                                    ],
                                                },
                                                { type: 'null' },
                                            ],
                                        },
                                        windSpeed: { type: ['null', 'string'] },
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
                                        'relativeHumidity',
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
                            generatedAt: { type: 'string' },
                            updateTime: { type: 'string' },
                        },
                        required: [
                            'elevation',
                            'generatedAt',
                            'periods',
                            'units',
                            'updateTime',
                        ],
                    },
                },
            },
            required: ['forecastsHourly'],
        },
        GetFavoritesInput: { type: 'object' },
        GetFavoritesOutput: {
            type: 'object',
            properties: {
                favoriteSpots: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            latitude: { type: 'number' },
                            longitude: { type: 'number' },
                            polygonID: { type: 'string' },
                            gridX: { type: 'number' },
                            gridY: { type: 'number' },
                            creator: { type: 'string' },
                        },
                        required: [
                            'creator',
                            'gridX',
                            'gridY',
                            'id',
                            'latitude',
                            'longitude',
                            'name',
                            'polygonID',
                        ],
                    },
                },
            },
            required: ['favoriteSpots'],
        },
        PostFavoriteInput: {
            type: 'object',
            properties: { spotId: { type: 'number' } },
            required: ['spotId'],
        },
        PostFavoriteOutput: { type: 'object' },
        DeleteFavoriteInput: {
            type: 'object',
            properties: { spotId: { type: 'number' } },
            required: ['spotId'],
        },
        DeleteFavoriteOutput: { type: 'object' },
        User: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
                email: { type: 'string' },
            },
            required: ['email', 'password', 'username'],
        },
        PostUserInput: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' },
                        email: { type: 'string' },
                    },
                    required: ['email', 'password', 'username'],
                },
                testUser: { type: 'boolean' },
            },
            required: ['testUser', 'user'],
        },
        PostUserOutput: { type: 'object' },
        PostAuthInput: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
            required: ['password', 'username'],
        },
        PostAuthOutput: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
            },
            required: ['accessToken', 'refreshToken'],
        },
        PostConfirmationInput: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                confirmationCode: { type: 'string' },
            },
            required: ['confirmationCode', 'username'],
        },
        PostConfirmationOutput: { type: 'object' },
        PostRefreshInput: {
            type: 'object',
            properties: { refreshToken: { type: 'string' } },
            required: ['refreshToken'],
        },
        PostRefreshOutput: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
            },
            required: ['accessToken'],
        },
        DeleteUserInput: {
            type: 'object',
            properties: { accessToken: { type: 'string' } },
            required: ['accessToken'],
        },
        DeleteUserOutput: { type: 'object' },
        PostForecastRefreshInput: {
            type: 'object',
            properties: { spotId: { type: 'number' } },
            required: ['spotId'],
        },
        PostForecastRefreshOutput: { type: 'object' },
        PostNewConfirmationCodeInput: {
            type: 'object',
            properties: { username: { type: 'string' } },
            required: ['username'],
        },
        PostNewConfirmationCodeOutput: { type: 'object' },
        GridInfo: {
            type: 'object',
            properties: {
                gridX: { type: 'number' },
                gridY: { type: 'number' },
                gridId: { type: 'string' },
            },
            required: ['gridId', 'gridX', 'gridY'],
        },
    },
} as const;
export default schema.definitions;
