import { Request, Response } from "express";

interface IResponseData<T> {
  message: string;
  data?: T;
}

export abstract class BaseController {
  abstract executeImpl(req: Request, res: Response): Promise<void | any>;

  public async execute(req: Request, res: Response) {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      console.log("[Base Controller]: Uncaught Exception Occured.");
      this.internalServerError(res, err);
    }
  }

  public ok<T>(res: Response, dto?: T, message?: string) {
    const responseData: IResponseData<T> = {
      message: message || "OK.",
      data: dto,
    };

    if (!dto) delete responseData.data;
    return res.status(200).json(responseData);
  }

  public created(res: Response, message?: string) {
    return res.status(201).json({
      message: message || "Created.",
    });
  }

  public badRequest(res: Response, error?: any, message?: string) {
    return res.status(400).json({
      message: message || "Bad Request.",
      error,
    });
  }

  public unauthorized(res: Response, message?: string) {
    return res.status(401).json({
      message: message || "Unauthorized Request.",
    });
  }

  public paymentRequired(res: Response, message?: string) {
    return res.status(402).json({
      message: message || "Payment Required.",
    });
  }

  public forbiddenAccess(res: Response, message?: string) {
    return res.status(403).json({
      message: message || "Forbidden Access.",
    });
  }

  public notFound(res: Response, message?: string) {
    return res.status(404).json({
      message: message || "Not Found.",
    });
  }

  public conflict(res: Response, message?: string) {
    return res.status(409).json({
      message: message || "Resource Conflict.",
    });
  }

  public unprocessableEntity(res: Response, message?: string) {
    return res.status(422).json({
      message: message || "Unprocessable Entity.",
    });
  }

  public tooManyRequest(res: Response, message?: string) {
    return res.status(429).json({
      message: message || "Too Many Request.",
    });
  }

  public internalServerError(res: Response, err: unknown | Error | string) {
    return res.status(500).json({
      message: "Internal Server Error",
      errorMessage: err,
    });
  }
}
