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
import { DeleteMenuUseCase } from "../useCases/menus/DeleteMenuUseCase";
import { GetAllMenusUseCase } from "../useCases/menus/GetAllMenusUseCase";
import { GetMenusUseCase } from "../useCases/menus/GetMenus";
import { SaveMenuUseCase } from "../useCases/menus/SaveMenuUseCase";
import { ConfirmOrderUseCase } from "../useCases/orders/ConfirmOrderUseCase";
import { GetAllOrdersUseCase } from "../useCases/orders/GetAllOrdersUseCase";
import { GetOrderHistoriesUseCase } from "../useCases/orders/GetOrderHistoriesUseCase";
import { MakeOrderUseCase } from "../useCases/orders/MakeOrderUseCase";
import { ViewOrderUseCase } from "../useCases/orders/ViewOrderUseCase";

// The Menu Use Cases
export const getMenusController = new GetMenusUseCase(menuRepository);

export const getAllMenusController = new GetAllMenusUseCase(menuRepository);

export const saveMenuController = new SaveMenuUseCase(menuRepository);

export const deleteMenuController = new DeleteMenuUseCase(menuRepository);

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
export const getAllOrdersController = new GetAllOrdersUseCase(orderRepository);

export const makeOrderController = new MakeOrderUseCase(
  cartRepository,
  customerRepository,
  tableRepository,
  orderRepository
);

export const viewOrderController = new ViewOrderUseCase(orderRepository);

export const getOrderHistoriesController = new GetOrderHistoriesUseCase(
  customerRepository,
  orderRepository,
  tableRepository
);

export const confirmOrderController = new ConfirmOrderUseCase(orderRepository);
