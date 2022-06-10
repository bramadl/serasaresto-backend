import { Router } from "express";
import { cartRouter } from "./carts.api";

import { customerRouter } from "./customers.api";
import { menuRouter } from "./menus.api";

export const apiRoutes = Router();

apiRoutes.use("/customers", customerRouter);
apiRoutes.use("/menus", menuRouter);
apiRoutes.use("/carts", cartRouter);
