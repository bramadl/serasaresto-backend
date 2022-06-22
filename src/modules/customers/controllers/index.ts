import { orderRepository } from "../../orders/repositories";
import { customerRepository, tableRepository } from "../repositories";
import { GetCustomersUseCase } from "../useCases/GetCustomersUseCase";
import { GetLastTenCustomersUseCase } from "../useCases/GetLastTenCustomersUseCase";
import { GetTableTokenUseCase } from "../useCases/GetTableTokenUseCase";
import { LogoutApplicationUseCase } from "../useCases/LogoutApplicationUseCase";
import { RemoveCustomerUseCase } from "../useCases/RemoveCustomerUseCase";
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

export const getCustomersUseCase = new GetCustomersUseCase(customerRepository);

export const getTenLatestCustomersController = new GetLastTenCustomersUseCase(
  customerRepository
);

export const removeCustomerUseCase = new RemoveCustomerUseCase(
  customerRepository
);
