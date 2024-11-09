import { get_app_config } from 'ww-3-app-config-tjb';
import { createServer } from './app';

const port = get_app_config().forecastServicePort;
createServer().then((server) => {
    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
