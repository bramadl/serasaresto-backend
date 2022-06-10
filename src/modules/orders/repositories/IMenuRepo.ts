import { Result } from "../../../shared/logic/Result";
import { Menu } from "../domains/Menu";

export interface SearchOption {
  search?: string;
  perPage?: string;
  page?: string;
  type: string;
}

export interface PaginationConstructor {
  perPage: number;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextItems: boolean;
  hasPreviousItems: boolean;
}

export interface IMenuRepo {
  getMenus(
    option: SearchOption
  ): Promise<{ data: Result<Menu[]>; pagination: PaginationConstructor }>;

  findMenuById(id: string): Promise<Result<Menu>>;
}
