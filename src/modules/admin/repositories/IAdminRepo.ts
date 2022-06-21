import { IRepo } from "../../../shared/core/Repo";
import { Admin } from "../domains/Admin";
import { AdminEmail } from "../domains/valueObjects/AdminEmail";

export interface IAdminRepo extends IRepo<Admin> {
  getById(id: string): Promise<Admin | null>;
  getByEmail(email: AdminEmail): Promise<Admin | null>;
}
