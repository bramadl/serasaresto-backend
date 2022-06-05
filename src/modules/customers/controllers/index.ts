import { customerRepository, tableRepository } from "../repositories";
import { GetTableTokenUseCase } from "../useCases/GetTableTokenUseCase";
import { ReserveTableUseCase } from "../useCases/ReserveTableUseCase";

export const getTableTokenController = new GetTableTokenUseCase(
  tableRepository
);

export const reserveTableController = new ReserveTableUseCase(
  tableRepository,
  customerRepository
);
