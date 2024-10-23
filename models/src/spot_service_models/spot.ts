export class Spot {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly polygonID: string,
        public readonly gridX: number,
        public readonly gridY: number,
        public readonly creator: string
    ) {}
}
