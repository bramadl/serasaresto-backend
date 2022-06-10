import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { ICartDTO } from "../../dtos/ICartDTO";
import { CartMap } from "../../mappings/CartMap";
import { ICartRepo } from "../../repositories/ICartRepo";

export class GetCartUseCase extends BaseController {
  private cartRepo: ICartRepo;
  private tableRepo: ITableRepo;

  constructor(cartRepo: ICartRepo, tableRepo: ITableRepo) {
    super();
    this.cartRepo = cartRepo;
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take request params and validate.
      const { table_token: tableTokenRequest } = req.body;
      if (!tableTokenRequest) {
        return this.badRequest(res, "Missing some required params");
      }
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      if (createTableToken.isFailure) {
        return this.badRequest(res, createTableToken.error);
      }
      const tableToken = createTableToken.getValue();

      // 2. Find the corresponding table.
      const tableFromRepo = await this.tableRepo.findByTableToken(tableToken);
      if (tableFromRepo.isFailure) {
        return this.notFound(res, tableFromRepo.error);
      }
      const table = tableFromRepo.getValue();

      // 3. Find the cart by table id,
      const cartFromRepo = await this.cartRepo.getCartByTableId(table.id);
      if (cartFromRepo.isFailure) return this.notFound(res, cartFromRepo.error);
      const cart = cartFromRepo.getValue();

      // 4. Map cart to DTO.
      const cartDTO: ICartDTO = CartMap.toDTO(cart);
      return this.ok(res, cartDTO);
    } catch (err) {
      console.log("[GetCartUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
