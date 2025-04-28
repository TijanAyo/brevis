import logger from "../utils/logger";
import Url from "../models";
import { notFoundException, badRequestException } from "../utils/exceptions";

interface ShortenUrlPayload {
  longURL: string;
}

interface ShortenUrlResponse {
  success: boolean;
  message: string;
  data: {
    shortCode: string;
    originalUrl: string;
  };
}

class UrlShortnerService {
  static async shortenUrl(
    payload: ShortenUrlPayload
  ): Promise<ShortenUrlResponse> {
    try {
      const shortCode = Math.random().toString(36).substring(2, 9);

      const newUrl = await Url.create({
        shortCode,
        originalUrl: payload.longURL,
      });

      if (!newUrl) {
        logger.error("Shorted url was not created successfully");
        throw new badRequestException(
          "Failed to shorten the provided URL. Please try again."
        );
      }

      return {
        success: true,
        message: "URL shortened successfully",
        data: {
          shortCode: newUrl.shortCode,
          originalUrl: newUrl.originalUrl,
        },
      };
    } catch (err: any) {
      logger.error(`Error shortening URL: ${err.message}`);
      throw err;
    }
  }

  static async getOriginalUrl(shortCode: string): Promise<string> {
    try {
      const url = await Url.findOne({ shortCode });

      if (!url) {
        throw new notFoundException("Short code reference does not exist");
      }

      return url.originalUrl;
    } catch (err: any) {
      logger.error(`Error retrieving original URL: ${err.message}`);
      throw err;
    }
  }
}

export default UrlShortnerService;
