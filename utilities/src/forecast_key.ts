export class ForecastKey {
    constructor(
        public readonly polygonID: string,
        public readonly gridX: number,
        public readonly gridY: number
    ) {}

    public getKeyStr() {
        return `${this.polygonID}_${this.gridX}_${this.gridY}`;
    }

    public getForecastUrl() {
        return `https://api.weather.gov/gridpoints/${this.polygonID}/${this.gridX},${this.gridY}/forecast`;
    }

    public getForecastHourlyUrl() {
        return `https://api.weather.gov/gridpoints/${this.polygonID}/${this.gridX},${this.gridY}/forecast/hourly`;
    }
}
