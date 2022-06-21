import jwt, { JwtPayload } from "jsonwebtoken";
import moment from "moment";

export class JWT {
  public static generateAccessToken(userId: string, userName: string) {
    const payload: JwtPayload = {
      sub: userId,
      iss: userName,
      admin: true,
      iat: moment().unix(),
    };

    return jwt.sign(payload, "secret", {
      expiresIn: "1h",
    });
  }

  public static verifyToken(token: string) {
    return jwt.verify(token, "secret");
  }
}
