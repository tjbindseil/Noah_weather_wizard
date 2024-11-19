/* eslint-disable camelcase */
import { get_app_config } from 'ww-3-app-config-tjb';

export const baseUrl = `http://${get_app_config(process.env.REACT_APP_WW_ENV).frontendServiceHost}:${get_app_config().frontendServicePort}`;
