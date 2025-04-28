import {
  badRequestException,
  internalServerException,
  notFoundException,
  validationException,
} from "./exceptions";
import { Response } from "express";
import logger from "./logger";
import http from "http";

const errorMapping = new Map([
  [notFoundException, Number(http.STATUS_CODES[404])],
  [badRequestException, Number(http.STATUS_CODES[400])],
  [internalServerException, Number(http.STATUS_CODES[500])],
  [validationException, Number(http.STATUS_CODES[422])],
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
