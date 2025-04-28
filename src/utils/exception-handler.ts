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
  [notFoundException, { code: 404, message: http.STATUS_CODES[404] }],
  [badRequestException, { code: 400, message: http.STATUS_CODES[400] }],
  [internalServerException, { code: 500, message: http.STATUS_CODES[500] }],
  [validationException, { code: 422, message: http.STATUS_CODES[422] }],
]);

export async function exceptionHandler(err: any, res: Response) {
  for (const [exception, status] of errorMapping) {
    if (err instanceof exception) {
      return res.status(status.code).json({
        success: false,
        error: status.message,
        message: err.message,
      });
    }
  }

  logger.error(err);
  return res.status(500).json({
    error: http.STATUS_CODES[500],
    message:
      "An error occurred while processing your request. Please try again later.",
    success: false,
    // status: http.STATUS_CODES[500],
  });
}
