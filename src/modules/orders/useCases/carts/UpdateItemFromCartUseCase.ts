import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { ICartRepo } from "../../repositories/ICartRepo";

export class UpdateItemFromCartUseCase extends BaseController {
  private cartRepo: ICartRepo;
  private tableRepo: ITableRepo;

  constructor(cartRepo: ICartRepo, tableRepo: ITableRepo) {
    super();
    this.cartRepo = cartRepo;
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take request data.
      const tableTokenRequest = (req.headers.authorization as string).split(
        " "
      )[1];
      const { id: menuIdRequest } = req.params;
      const { quantity, note, cart_id } = req.body;

      // 2. Validate request data.

      // FINAL. Send response
      this.ok(res, {
        tableTokenRequest,
        menuIdRequest,
        quantity,
        note,
        cart_id,
      });
    } catch (err) {
      console.log("[UpdateItemFromCartUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
