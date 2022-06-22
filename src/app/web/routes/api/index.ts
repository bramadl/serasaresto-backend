import { Router } from "express";

import { adminRouter } from "./admin.api";
import { cartRouter } from "./carts.api";
import { customerRouter } from "./customers.api";
import { menuRouter } from "./menus.api";
import { orderRouter } from "./orders.api";
import { tableRouter } from "./tables.api";

export const apiRoutes = Router();

apiRoutes.use("/admin", adminRouter);
apiRoutes.use("/carts", cartRouter);
apiRoutes.use("/customers", customerRouter);
apiRoutes.use("/menus", menuRouter);
apiRoutes.use("/orders", orderRouter);
apiRoutes.use("/tables", tableRouter);
