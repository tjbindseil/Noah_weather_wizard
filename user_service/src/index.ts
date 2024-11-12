import { get_app_config } from 'ww-3-app-config-tjb';
import { server } from './app';

// TODO get port from app config, this is also in docker compose file
const port = get_app_config().userServicePort;
server.listen(port, '127.0.0.1', () => {
    console.log(`Listening on port ${port}`);
});
