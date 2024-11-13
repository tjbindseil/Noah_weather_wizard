import { get_app_config } from 'ww-3-app-config-tjb';
import { server } from './app';

// TODO use port in nginx, docker compose file
const port = get_app_config().userServiceListenPort;
server.listen(port, '127.0.0.1', () => {
    console.log(`Listening on port ${port}`);
});
