import { IRepo } from "../../../shared/core/Repo";
import { Admin } from "../domains/Admin";

export interface IAdminRepo extends IRepo<Admin> {
  getById(id: string): Promise<Admin | null>;
}
