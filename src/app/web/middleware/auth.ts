import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { JWT } from "../../../shared/logic/JWT";

const parseBearerFromHeader = (authorization: string) => {
  const [bearer, token] = authorization.split(" ");
  return { bearer, token };
};

export const auth =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(403);
    const { token } = parseBearerFromHeader(req.headers.authorization);

    try {
      const payload = JWT.verifyToken(token) as JwtPayload;
      if (role === "admin" && !payload.admin) return res.sendStatus(403);
      req.app.locals.user = payload;
      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        return res.sendStatus(403);
      }
    }
  };
