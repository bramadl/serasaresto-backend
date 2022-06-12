import { NextFunction, Request, Response } from "express";
import { TableToken } from "../../../modules/customers/domains/valueObjects/TableToken";
import { tableRepository } from "../../../modules/customers/repositories";

export async function verifyTableToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers.authorization;
  if (!headers) {
    return res
      .status(401)
      .json({ message: "Unauthorized, please provide a valid table token." });
  }

  const [bearer, token] = headers.split(" ");
  if (bearer !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Unauthorized, please use a valid bearer type." });
  }

  const createToken = TableToken.create({ value: token });
  const tableRepo = await tableRepository.findByTableToken(
    createToken.getValue()
  );
  if (tableRepo.isFailure) {
    return res
      .status(403)
      .json({ message: "Unauthorized, table could not be found." });
  }

  const table = tableRepo.getValue();
  if (table.token.value === token) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Meja ini sedang direservasi orang lain." });
  }
}
