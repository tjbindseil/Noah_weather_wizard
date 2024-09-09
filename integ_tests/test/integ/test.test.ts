import { waitForMS, waitUntil } from 'dwf-3-api-tjb';
import { get_app_config } from 'dwf-3-app-config-tjb';
import {
    ClientToServerEvents,
    GetUpdateToolSettingsOutput,
    JoinPictureResponse,
    PixelUpdate,
    ServerToClientEvents,
    Update,
    UpdateToolSettings,
} from 'dwf-3-models-tjb';
import { Socket, io } from 'socket.io-client';
import { Raster } from '../../../raster/build';
import { seedSettings } from './setup/seedSettings';
import {
    UserWithToken,
    testUser1,
    testUser2,
    testUser3,
} from './setup/seedUsers';
import {
    createPicture,
    makePostPictureInput,
    authUser,
    deleteMultiplePictures,
} from './api_helpers';
import { fetchWithError } from './api_helpers/fetch_with_error';

describe('General integ tests', () => {
    const createdPictureIds: Map<number, UserWithToken> = new Map();

    const broadcastServiceBaseUrl = `http://${
        get_app_config().broadcastServiceHost
    }:${get_app_config().broadcastServicePort}`;
    const updateToolSettingsServiceBaseUrl = `http://${
        get_app_config().updateToolSettingsServiceHost
    }:${get_app_config().updateToolSettingsServicePort}`;

    const makePixelUpdate = (pictureId: number) =>
        new PixelUpdate({
            pictureId: pictureId,
            createdBy: 'INTEG_TESTS',
            point: {
                x: 4,
                y: 20,
            },
            color: {
                red: 69,
                green: 69,
                blue: 69,
            },
        });

    const socketsToClose: Socket<ServerToClientEvents, ClientToServerEvents>[] =
        [];
    // undefined represents no update, set it back to that when getting something
    // that would imply access functions
    class SocketResponseMailbox {
        private receivedUpdate: Update | undefined;
        private receivedJoinPictureResponse: JoinPictureResponse | undefined;
        private receivedLeavePictureResponse: boolean | undefined; // there is no leave picture response, so true indicates it arrived

        constructor(
            socket: Socket<ServerToClientEvents, ClientToServerEvents>
        ) {
            socket.on('server_to_client_update', (update: Update) => {
                // TODO may need a queue here
                this.receivedUpdate = update;
            });
            socket.on(
                'join_picture_response',
                (joinPictureResponse: JoinPictureResponse) => {
                    this.receivedJoinPictureResponse = joinPictureResponse;
                }
            );
            socket.on('leave_picture_response', () => {
                this.receivedLeavePictureResponse = true;
            });
        }

        isUpdatePending = (): boolean => this.receivedUpdate !== undefined;
        isJoinPictureResponsePending = (): boolean =>
            this.receivedJoinPictureResponse !== undefined;
        isLeavePictureResponsePending = (): boolean =>
            this.receivedLeavePictureResponse !== undefined;

        getUpdate = (): Update | undefined => {
            const ret = this.receivedUpdate;
            this.receivedUpdate = undefined;
            return ret;
        };

        getJoinPictureResponse = (): JoinPictureResponse | undefined => {
            const ret = this.receivedJoinPictureResponse;
            this.receivedJoinPictureResponse = undefined;
            return ret;
        };

        getLeavePictureResponse = (): boolean | undefined => {
            const ret = this.receivedLeavePictureResponse;
            this.receivedLeavePictureResponse = undefined;
            return ret;
        };
    }
    const socketResponsePostOffice: Map<string, SocketResponseMailbox> =
        new Map();
    const getSocketMB = (
        socketID: string | undefined
    ): SocketResponseMailbox => {
        if (!socketID) {
            throw Error('socketID undefined when calling getSocketMD');
        }
        const ret = socketResponsePostOffice.get(socketID);
        if (!ret) {
            throw Error('socketID requested but not in map');
        }
        return ret;
    };
    const createClientSocket = async (): Promise<
        Socket<ServerToClientEvents, ClientToServerEvents>
    > => {
        const socket = io(broadcastServiceBaseUrl);
        socketsToClose.push(socket);
        const result = await waitUntil(() => socket.connected);
        if (!result) {
            throw Error('socket never connected');
        }
        if (!socket.id) {
            throw Error('socket still undefined after creation and connection');
        }
        socketResponsePostOffice.set(
            socket.id,
            new SocketResponseMailbox(socket)
        );
        return socket;
    };

    beforeAll(async () => {
        const authPromises: Promise<void>[] = [];
        [testUser1, testUser2, testUser3].forEach((u) =>
            authPromises.push(authUser(u))
        );
        await Promise.all(authPromises);
    });

    it('gets raster when joining picture', async () => {
        const picName = 'GETS_RASTER_TEST_PIC_NAME';
        const expectedPostPictureInput = makePostPictureInput(
            testUser1.username,
            picName,
            {}
        );
        const output = await createPicture(
            testUser1,
            picName,
            createdPictureIds,
            expectedPostPictureInput
        );

        const picture = output.picture;
        const socket = await createClientSocket();

        socket.emit('join_picture_request', { picture });

        const successful = await waitUntil(() => {
            return getSocketMB(socket.id).isJoinPictureResponsePending();
        });
        expect(successful).toBe(true);

        const joinPictureResponse = getSocketMB(
            socket.id
        ).getJoinPictureResponse();
        if (joinPictureResponse) {
            expect(joinPictureResponse.height).toEqual(
                expectedPostPictureInput.height
            );
            expect(joinPictureResponse.width).toEqual(
                expectedPostPictureInput.width
            );
        } else {
            expect(joinPictureResponse).toBeDefined();
        }
    });

    it('receives updates, broadcasts them to everyone', async () => {
        const output = await createPicture(
            testUser1,
            'receives_updates_and_broadcasts',
            createdPictureIds
        );

        const picture = output.picture;

        const socket1 = await createClientSocket();
        const socket2 = await createClientSocket();

        socket1.emit('join_picture_request', { picture });
        socket2.emit('join_picture_request', { picture });

        const successfullyJoined = await waitUntil(
            () =>
                getSocketMB(socket1.id).isJoinPictureResponsePending() &&
                getSocketMB(socket2.id).isJoinPictureResponsePending()
        );
        expect(successfullyJoined).toBe(true);

        socket1.emit('client_to_server_udpate', makePixelUpdate(picture.id));

        const successfullyReceivedUpdates = await waitUntil(
            () =>
                getSocketMB(socket1.id).isUpdatePending() &&
                getSocketMB(socket2.id).isUpdatePending()
        );
        expect(successfullyReceivedUpdates).toBe(true);
    });

    it('saves pictures', async () => {
        const picName = 'savesPicture';
        const expectedPostPictureInput = makePostPictureInput(
            testUser1.username,
            picName,
            {}
        );

        const privatePictureInput = makePostPictureInput(
            testUser1.username,
            picName,
            {}
        );

        const output = await createPicture(
            testUser3,
            picName,
            createdPictureIds,
            privatePictureInput
        );
        const picture = output.picture;

        const socket = await createClientSocket();

        socket.emit('join_picture_request', { picture });

        const successfullyJoined = await waitUntil(() =>
            getSocketMB(socket.id).isJoinPictureResponsePending()
        );
        expect(successfullyJoined).toBe(true);
        const initialJoinPictureResponse = getSocketMB(
            socket.id
        ).getJoinPictureResponse();
        if (!initialJoinPictureResponse) {
            throw Error(
                'initialJoinPictureResponse is still undefined after waiting'
            );
        }
        const initialData = initialJoinPictureResponse.data;

        const update = makePixelUpdate(picture.id);
        socket.emit('client_to_server_udpate', update);
        const successfullyReceivedUpdate = await waitUntil(() =>
            getSocketMB(socket.id).isUpdatePending()
        );
        expect(successfullyReceivedUpdate).toBe(true);

        socket.emit('leave_picture_request', { pictureId: output.picture.id });

        const successfullyLeft = await waitUntil(() =>
            getSocketMB(socket.id).isLeavePictureResponsePending()
        );
        expect(successfullyLeft).toBe(true);

        // wait for the write to actually happen
        await waitForMS(500);

        socket.emit('join_picture_request', { picture });
        const successfullyRejoined = await waitUntil(() =>
            getSocketMB(socket.id).isJoinPictureResponsePending()
        );
        expect(successfullyRejoined).toBe(true);
        const afterJoinPictureResponse = getSocketMB(
            socket.id
        ).getJoinPictureResponse();
        if (!afterJoinPictureResponse) {
            throw Error(
                'afterJoinPictureResponse is still undefined after waiting'
            );
        }
        const afterData = afterJoinPictureResponse.data;

        // update initial manually, ensure it is what we get back when we rejoin
        const initialAsRaster = new Raster(
            expectedPostPictureInput.width,
            expectedPostPictureInput.height,
            initialData
        );
        Update.updateRaster(initialAsRaster, update);
        const initialAsArray = initialAsRaster.getBuffer();

        const afterAsArray = new Uint8ClampedArray(afterData);

        expect(afterAsArray).toEqual(initialAsArray);
    });

    it("gets a user's update tool settings given their username", async () => {
        const relevantUser = testUser1;
        const expectedSettings = seedSettings.find(
            (settings) => settings.username === relevantUser.username
        );

        const output = await fetchWithError<GetUpdateToolSettingsOutput>(
            'getting uts',
            `${updateToolSettingsServiceBaseUrl}/settings?` +
                new URLSearchParams({
                    username: relevantUser.username,
                }),
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer: ${relevantUser.token}`,
                },
            }
        );

        // we don't care about the id
        expect(output.updateToolSettings).toEqual(expectedSettings);
    });

    it("updates a user's update tool settings given their username", async () => {
        const relevantUser = testUser2;
        const expectedSettings = seedSettings.find(
            (settings) => settings.username === relevantUser.username
        );

        const updateToolSettings = JSON.parse(
            JSON.stringify(expectedSettings)
        ) as UpdateToolSettings;

        const newColor = {
            red: 240,
            blue: 240,
            green: 240,
        };
        updateToolSettings.dotToolSettings.color = newColor;
        updateToolSettings.dotToolSettings.radius = 44;
        updateToolSettings.pixelToolSettings.color = newColor;
        updateToolSettings.lineToolSettings.color = newColor;
        updateToolSettings.lineToolSettings.thickness = 45;

        await fetchWithError(
            'posting uts',
            `${updateToolSettingsServiceBaseUrl}/settings`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer: ${relevantUser.token}`,
                },
                body: JSON.stringify({ updateToolSettings }),
            }
        );

        const output = await fetchWithError<GetUpdateToolSettingsOutput>(
            'getting uts',
            `${updateToolSettingsServiceBaseUrl}/settings?` +
                new URLSearchParams({
                    username: relevantUser.username,
                }),
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer: ${relevantUser.token}`,
                },
            }
        );

        // we don't care about the id
        expect(output.updateToolSettings).toEqual(updateToolSettings);
    });

    afterAll(async () => {
        socketsToClose.forEach((socket) => socket.close());

        await deleteMultiplePictures(createdPictureIds);
    });
});
