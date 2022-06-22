import { customerRepository } from "../../customers/repositories";
import { menuRepository, orderRepository } from "../../orders/repositories";
import { adminRepository } from "../repositories";
import { GetDashboardStatsUseCase } from "../useCases/GetDashboardStatsUseCase";
import { GetProfileUseCase } from "../useCases/GetProfileUseCase";
import { LoginUseCase } from "../useCases/LoginUseCase";

export const getProfileController = new GetProfileUseCase(adminRepository);
export const loginController = new LoginUseCase(adminRepository);
export const getDashboardStatsController = new GetDashboardStatsUseCase(
  customerRepository,
  menuRepository,
  orderRepository
);
