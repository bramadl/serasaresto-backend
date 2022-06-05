import { tableRepository } from "../repositories";
import { GetTableTokenUseCase } from "../useCases/GetTableToken/GetTableTokenUseCase";

export const getTableTokenController = new GetTableTokenUseCase(
  tableRepository
);
