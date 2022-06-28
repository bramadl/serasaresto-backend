import { MenuType } from "@prisma/client";
import { Request, Response } from "express";

import { BaseController } from "../../../../shared/core/BaseController";
import { Menu } from "../../domains/Menu";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class SaveMenuUseCase extends BaseController {
  constructor(private menuRepo: IMenuRepo) {
    super();
  }

  private badRequestMessage(name: string, price: string, type: string) {
    const messages = [];

    if (name === null || name === undefined) messages.push("'name'");
    if (price === null || price === undefined) messages.push("'price'");
    if (type === null || type === undefined) messages.push("'type'");

    return "Missing one of required props: " + messages.join(" | ");
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { description, name, price, type, inStock } = req.body;
      const thumbnail = req.file;

      if (
        name === null ||
        name === undefined ||
        price === null ||
        price === undefined ||
        type === null ||
        type === undefined
      ) {
        return this.badRequest(res, this.badRequestMessage(name, price, type));
      }

      const createMenu = Menu.create(
        {
          name,
          description,
          inStock: id ? inStock === "true" : true, // # FIXED TO BE IN STOCK WHEN FIRST CREATED.
          price: Number(price),
          type: type === "food" ? MenuType.FOOD : MenuType.DRINK,
          thumbnail: thumbnail
            ? `http://localhost:8000/storage/${thumbnail.filename}`
            : undefined,
        },
        id
      );

      const menu = createMenu.getValue();

      await this.menuRepo.save(menu);

      if (id) {
        this.ok(res, "Updated");
      } else {
        this.created(res);
      }
    } catch (err) {
      console.log("[SaveMenuUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
