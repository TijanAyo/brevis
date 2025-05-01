import UrlShortnerService from "../../../services/urlshortner";
import Url from "../../../models";
import redisInstance from "../../../config/redis";
import { badRequestException } from "../../../utils/exceptions";

jest.mock("../../../models");
jest.mock("../../../config/redis", () => ({
  getClient: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

describe("UrlShortnerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("shortenUrl", () => {
    it("should create a new short URL when URL does not exist", async () => {
      const mockUrl = {
        shortCode: "abc123",
        originalUrl: "https://example.com",
      };

      (Url.findOne as jest.Mock).mockResolvedValue(null);

      (Url.create as jest.Mock).mockResolvedValue(mockUrl);

      (redisInstance.getClient().set as jest.Mock).mockResolvedValue("OK");

      const result = await UrlShortnerService.shortenUrl({
        longURL: "https://example.com",
      });

      expect(result.success).toBe(true);
      expect(result.data.shortCode).toBe("abc123");
      expect(result.data.originalUrl).toBe("https://example.com");
      expect(Url.findOne).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
      });
      expect(Url.create).toHaveBeenCalled();
      expect(redisInstance.getClient().set).toHaveBeenCalled();
    });

    it("should return existing short URL when URL already exists", async () => {
      const mockUrl = {
        shortCode: "abc123",
        originalUrl: "https://example.com",
      };

      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const result = await UrlShortnerService.shortenUrl({
        longURL: "https://example.com",
      });

      expect(result.success).toBe(true);
      expect(result.data.shortCode).toBe("abc123");
      expect(result.data.originalUrl).toBe("https://example.com");
      expect(Url.findOne).toHaveBeenCalledWith({
        originalUrl: "https://example.com",
      });
      expect(Url.create).not.toHaveBeenCalled();
    });

    it("should handle errors during URL creation", async () => {
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      // simulate an error when creating shorten version of url
      (Url.create as jest.Mock).mockRejectedValue(
        new badRequestException(
          "Failed to shorten the provided URL. Please try again."
        )
      );

      await expect(
        UrlShortnerService.shortenUrl({
          longURL: "https://example.com",
        })
      ).rejects.toThrow(
        new badRequestException(
          "Failed to shorten the provided URL. Please try again."
        )
      );
    });
  });

  describe("getOriginalUrl", () => {
    it("should return URL from cache when available", async () => {
      const mockUrl = "https://example.com";

      (redisInstance.getClient().get as jest.Mock).mockResolvedValue(mockUrl);

      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue({
        shortCode: "abc123",
      });

      const result = await UrlShortnerService.getOriginalUrl("abc123");

      expect(result).toBe("https://example.com");
      expect(redisInstance.getClient().get).toHaveBeenCalledWith("url:abc123");
      expect(Url.findOneAndUpdate).toHaveBeenCalled();
    });

    it("should fetch from database and cache when not in cache", async () => {
      const mockUrl = {
        shortCode: "abc123",
        originalUrl: "https://example.com",
      };

      (redisInstance.getClient().get as jest.Mock).mockResolvedValue(null);

      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUrl);

      (redisInstance.getClient().set as jest.Mock).mockResolvedValue("OK");

      const result = await UrlShortnerService.getOriginalUrl("abc123");

      expect(result).toBe("https://example.com");
      expect(redisInstance.getClient().get).toHaveBeenCalledWith("url:abc123");
      expect(Url.findOneAndUpdate).toHaveBeenCalled();
      expect(redisInstance.getClient().set).toHaveBeenCalled();
    });

    it("should throw error when URL not found", async () => {
      (redisInstance.getClient().get as jest.Mock).mockResolvedValue(null);

      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        UrlShortnerService.getOriginalUrl("invalid")
      ).rejects.toThrow("Unable to resolve provided shortcode");
    });
  });
});
