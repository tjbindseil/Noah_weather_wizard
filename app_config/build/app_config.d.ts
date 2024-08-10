import { SSL, SSLMode } from 'ts-postgres';
export interface AppConfig {
    locationServiceHost: string;
    locationServicePort: number;
    locationDbConnectionConfig: {
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
        ssl: SSLMode.Disable | SSL | undefined;
    };
}
export declare const get_app_config: () => AppConfig;
