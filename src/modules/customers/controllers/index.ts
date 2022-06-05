import { tableRepository } from "../repositories";
import { GetTableTokenUseCase } from "../useCases/GetTableTokenUseCase";

export const getTableTokenController = new GetTableTokenUseCase(
  tableRepository
);
