import { get_app_config } from 'ww-3-app-config-tjb';
import { server } from './app';

// TODO get port from app config, this is also in docker compose file
const port = get_app_config().locationServicePort;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
