import { orderRepository } from "../../orders/repositories";
import { customerRepository, tableRepository } from "../repositories";
import { GetLastTenCustomersUseCase } from "../useCases/GetLastTenCustomersUseCase";
import { GetTableTokenUseCase } from "../useCases/GetTableTokenUseCase";
import { LogoutApplicationUseCase } from "../useCases/LogoutApplicationUseCase";
import { ReserveTableUseCase } from "../useCases/ReserveTableUseCase";

export const getTableTokenController = new GetTableTokenUseCase(
  tableRepository
);

export const reserveTableController = new ReserveTableUseCase(
  tableRepository,
  customerRepository
);

export const logoutApplicationController = new LogoutApplicationUseCase(
  tableRepository,
  customerRepository,
  orderRepository
);

export const getTenLatestCustomersController = new GetLastTenCustomersUseCase(
  customerRepository
);
