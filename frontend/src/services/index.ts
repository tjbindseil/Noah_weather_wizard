/* eslint-disable camelcase */
import { get_app_config } from 'ww-3-app-config-tjb';

// TODO could i use a global.d.ts file to augment the get_app_config and automatically feed it the REACT_APP_WW_ENV var?
export const baseUrl = `http://${get_app_config(process.env.REACT_APP_WW_ENV).frontendServiceHost}:${get_app_config(process.env.REACT_APP_WW_ENV).frontendServicePort}`;
