import { get_app_config } from 'ww-3-app-config-tjb';

export const baseUrl = `http://${get_app_config().frontendHost}:${
    get_app_config().frontendServicePort
}`;
