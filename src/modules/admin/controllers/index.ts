import { adminRepository } from "../repositories";
import { LoginUseCase } from "../useCases/LoginUseCase";

export const loginController = new LoginUseCase(adminRepository);
