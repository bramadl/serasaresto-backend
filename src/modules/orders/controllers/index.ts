import { cartRepository, tableRepository } from "../../customers/repositories";
import { menuRepository } from "../repositories";
import { AddItemToCartUseCase } from "../useCases/carts/AddItemToCartUseCase";
import { GetCartUseCase } from "../useCases/carts/GetCartUseCase";
import { RemoveItemFromCartUseCase } from "../useCases/carts/RemoveItemFromCartUseCase";
import { UpdateItemFromCartUseCase } from "../useCases/carts/UpdateItemFromCartUseCase";
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

export const updateItemFromCartController = new UpdateItemFromCartUseCase(
  cartRepository,
  menuRepository,
  tableRepository
);

export const removeItemFromCartController = new RemoveItemFromCartUseCase(
  cartRepository,
  menuRepository,
  tableRepository
);
