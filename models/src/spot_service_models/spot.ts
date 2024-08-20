export class Spot {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly polygonID: string
    ) {}
}
