import { config } from "dotenv";
import { join } from "path";

config({ path: join(__dirname, "../../../", ".env") });

export * from "./app";
export * from "./db";
