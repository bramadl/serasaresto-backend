import {
  cartRepository,
  customerRepository,
  tableRepository,
} from "../../customers/repositories";
import { menuRepository, orderRepository } from "../repositories";
import { AddItemToCartUseCase } from "../useCases/carts/AddItemToCartUseCase";
import { GetCartUseCase } from "../useCases/carts/GetCartUseCase";
import { RemoveItemFromCartUseCase } from "../useCases/carts/RemoveItemFromCartUseCase";
import { UpdateItemFromCartUseCase } from "../useCases/carts/UpdateItemFromCartUseCase";
import { GetMenusUseCase } from "../useCases/menus/GetMenus";
import { MakeOrderUseCase } from "../useCases/orders/MakeOrderUseCase";
import { ViewOrderUseCase } from "../useCases/orders/ViewOrderUseCase";

// The Menu Use Cases
export const getMenusController = new GetMenusUseCase(menuRepository);

// The Cart Use Cases
export const getCartController = new GetCartUseCase(
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

// The Order Use Cases
export const makeOrderController = new MakeOrderUseCase(
  cartRepository,
  customerRepository,
  tableRepository,
  orderRepository
);

export const viewOrderController = new ViewOrderUseCase(orderRepository);
