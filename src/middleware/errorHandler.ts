import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: any;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ErrorResponse = {
    success: false,
    message: "An error occurred",
  };

  if (isCelebrateError(err)) {
    console.log(err, "<<<<< celebrate error");
    console.log(err.details, "<<<< celebrate error details");

    const validationError =
      err.details.get("query") ||
      err.details.get("body") ||
      err.details.get("params");
    response.message = "Validation Error";
    response.errors = validationError?.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return res.status(400).json(response);
  }

  if (err instanceof Error) {
    response.message = err.message;
  }

  console.error(err);

  return res.status(500).json(response);
};
