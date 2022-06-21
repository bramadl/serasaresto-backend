import jwt from "jsonwebtoken";

export class JWT {
  public static generateAccessToken(userId: string, userName: string) {
    return jwt.sign(
      {
        sub: userId,
        iss: userName,
        iat: new Date(),
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );
  }
}
