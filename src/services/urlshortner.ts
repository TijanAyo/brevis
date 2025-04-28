import logger from "../utils/logger";
import Url from "../models";
import { notFoundException, badRequestException } from "../utils/exceptions";
import redisInstance from "../config/redis";

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
  static readonly SEVEN_DAYS_CACHE_TTL_IN_SECONDS = 7 * 24 * 60 * 60;

  static async shortenUrl(
    payload: ShortenUrlPayload
  ): Promise<ShortenUrlResponse> {
    try {
      const existingUrl = await Url.findOne({ originalUrl: payload.longURL });

      if (!existingUrl) {
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

        // cache new url
        await redisInstance
          .getClient()
          .set(
            `url:${shortCode}`,
            newUrl.originalUrl,
            "EX",
            UrlShortnerService.SEVEN_DAYS_CACHE_TTL_IN_SECONDS
          );

        return {
          success: true,
          message: "URL shortened successfully",
          data: {
            shortCode: newUrl.shortCode,
            originalUrl: newUrl.originalUrl,
          },
        };
      }

      return {
        success: true,
        message: "URL already shortened",
        data: {
          shortCode: existingUrl.shortCode,
          originalUrl: existingUrl.originalUrl,
        },
      };
    } catch (err: any) {
      logger.error(`Error shortening URL: ${err.message}`);
      throw err;
    }
  }

  static async getOriginalUrl(shortCode: string): Promise<string> {
    try {
      const cachedURL = await redisInstance.getClient().get(`url:${shortCode}`);
      if (!cachedURL) {
        const url = await Url.findOneAndUpdate(
          { shortCode },
          { $inc: { clicks: 1 } },
          { new: true }
        );

        if (!url) {
          throw new notFoundException("Unable to resolve provided shortcode");
        }

        await redisInstance
          .getClient()
          .set(
            `url:${shortCode}`,
            url.originalUrl,
            "EX",
            UrlShortnerService.SEVEN_DAYS_CACHE_TTL_IN_SECONDS
          );

        return url.originalUrl;
      }
      await Url.findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } });

      return cachedURL;
    } catch (err: any) {
      logger.error(`Error retrieving original URL: ${err.message}`);
      throw err;
    }
  }
}

export default UrlShortnerService;
