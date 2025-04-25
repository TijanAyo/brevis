import {
  badRequestException,
  internalServerException,
  notFoundException,
  validationException,
} from "./exceptions";
import { Response } from "express";
import logger from "./logger";

const errorMapping = new Map([
  [notFoundException, 404],
  [badRequestException, 400],
  [internalServerException, 500],
  [validationException, 422],
]);

export async function exceptionHandler(err: any, res: Response) {
  for (const [exception, statusCode] of errorMapping) {
    if (err instanceof exception) {
      return res.status(statusCode).json({
        success: false,
        error: err.name,
        message: err.message,
      });
    }
  }

  logger.error(err);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message:
      "An error occurred while processing your request. Please try again later.",
    success: false,
  });
}
