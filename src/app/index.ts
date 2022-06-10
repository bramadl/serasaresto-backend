import express, { Application } from "express";
import { Server } from "http";
import cors from "cors";

import { APP_CONFIG } from "./config";
import routes from "./web/routes";

const { APP_PORT } = APP_CONFIG;

export class App {
  private app: Application;
  private appInstance?: Server;

  constructor() {
    this.app = express();
    this.initializeApplication();
  }

  private initializeApplication(): void {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(routes);
  }

  public start() {
    this.appInstance = this.app.listen(APP_PORT, () => {
      console.log(`[Server Starting]: Application running on port ${APP_PORT}`);
    });
  }

  public stop() {
    if (this.appInstance) {
      this.appInstance.close((err) => {
        console.log(err);
        console.log("[Server Stopping]");
      });
    } else {
      console.log("[Server Stopping]");
    }
  }
}
