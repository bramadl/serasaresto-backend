import { customerRepository } from "../../customers/repositories";
import { menuRepository, orderRepository } from "../../orders/repositories";
import { adminRepository } from "../repositories";
import { CreateAdminUseCase } from "../useCases/CreateAdminUseCase";
import { DeleteAdminUseCase } from "../useCases/DeleteAdminUseCase";
import { GetDashboardStatsUseCase } from "../useCases/GetDashboardStatsUseCase";
import { GetProfileUseCase } from "../useCases/GetProfileUseCase";
import { LoginUseCase } from "../useCases/LoginUseCase";

export const createAdminController = new CreateAdminUseCase(adminRepository);
export const deleteAdminController = new DeleteAdminUseCase(adminRepository);
export const getProfileController = new GetProfileUseCase(adminRepository);
export const loginController = new LoginUseCase(adminRepository);
export const getDashboardStatsController = new GetDashboardStatsUseCase(
  customerRepository,
  menuRepository,
  orderRepository
);
