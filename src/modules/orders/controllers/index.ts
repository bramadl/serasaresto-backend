import { cartRepository, tableRepository } from "../../customers/repositories";
import { menuRepository } from "../repositories";
import { AddItemToCartUseCase } from "../useCases/carts/AddItemToCart";
import { GetCartUseCase } from "../useCases/carts/GetCart";
import { GetMenusUseCase } from "../useCases/menus/GetMenus";

export const getMenusController = new GetMenusUseCase(menuRepository);

export const getCartUseCase = new GetCartUseCase(
  cartRepository,
  tableRepository
);

export const addItemToCartController = new AddItemToCartUseCase(
  cartRepository,
  menuRepository,
  tableRepository
);
