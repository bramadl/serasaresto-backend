import jwt from "jsonwebtoken";
import moment from "moment";

export class JWT {
  public static generateAccessToken(userId: string, userName: string) {
    return jwt.sign(
      {
        sub: userId,
        iss: userName,
        iat: moment().unix(),
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );
  }
}
