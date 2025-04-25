import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import logger from "../utils/logger";
import { exceptionHandler } from "../utils/exception-handler";
import { ZodError } from "zod";
import http from "http";

interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ErrorResponse = {
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "An internal server error has occurred",
  };

  if (isCelebrateError(err)) {
    const validationError =
      err.details.get("body") ||
      err.details.get("query") ||
      err.details.get("params");
    const message =
      validationError?.details[0].message
        .replace(/["]+/g, "")
        .replace(/_/g, " ") || "Invalid field value or missing required field";

    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: message,
    });
  }

  if (err instanceof Error) {
    return exceptionHandler(err, res);
  }

  logger.error(err);
  return res.status(500).json(response);
};
