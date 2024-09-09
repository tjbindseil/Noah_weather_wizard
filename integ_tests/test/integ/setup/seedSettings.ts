import { UpdateToolSettings, UpdateTypeEnum } from 'dwf-3-models-tjb';
import { testUser1, testUser2, testUser3 } from './seedUsers';

const color = {
    red: 45,
    green: 46,
    blue: 47,
};

export const seedSettings: UpdateToolSettings[] = [
    {
        username: testUser1.username,
        selectedUpdateType: UpdateTypeEnum.DotUpdate,
        pixelToolSettings: { color },
        lineToolSettings: { color, thickness: 5 },
        dotToolSettings: { color, radius: 6 },
        triangleToolSettings: { color },
        pencilToolSettings: { color, thickness: 7 },
    },
    {
        username: testUser2.username,
        selectedUpdateType: UpdateTypeEnum.DotUpdate,
        pixelToolSettings: { color },
        lineToolSettings: { color, thickness: 8 },
        dotToolSettings: { color, radius: 9 },
        triangleToolSettings: { color },
        pencilToolSettings: { color, thickness: 10 },
    },
    {
        username: testUser3.username,
        selectedUpdateType: UpdateTypeEnum.DotUpdate,
        pixelToolSettings: { color },
        lineToolSettings: { color, thickness: 11 },
        dotToolSettings: { color, radius: 12 },
        triangleToolSettings: { color },
        pencilToolSettings: { color, thickness: 13 },
    },
];
