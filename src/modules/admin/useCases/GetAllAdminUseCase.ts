import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { AdminMap } from "../mappings/AdminMap";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class GetAllAdminUseCase extends BaseController {
    constructor(private adminRepo: IAdminRepo) {
        super();
    }

    public async executeImpl(req: Request, res: Response): Promise<any> {
        try {
            const admins = await this.adminRepo.getAll();
            const adminDTO = admins.map((admin) => AdminMap.toDTO(admin))

            return this.ok(res, adminDTO);
        } catch (error) {
            console.log("[GetAllAdminUseCaseError]", error);
            this.internalServerError(res, (error as Error).message);
        }
    }
}