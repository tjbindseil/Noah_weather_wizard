import { get_app_config } from 'ww-3-app-config-tjb';
import { createServer } from './app';

const port = get_app_config().spotServiceListenPort;
createServer().then((server) => {
    server.listen(port, '127.0.0.1', () => {
        console.log(`Listening on port ${port}`);
    });
});
