/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface IAppConfig {
  NODE_ENV: string;
  APP_PORT: number;
}

export const APP_CONFIG: IAppConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 8000,
};
