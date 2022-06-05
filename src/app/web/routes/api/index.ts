import { Router } from "express";

import { customerRouter } from "./customers.api";

export const apiRoutes = Router();

apiRoutes.use("/customers", customerRouter);
