import request from "supertest";
import { app } from "../../../index";
import Url from "../../../models";
import redisInstance from "../../../config/redis";
import mongoose from "mongoose";

jest.mock("../../../models");
jest.mock("../../../config/redis", () => ({
  getClient: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    quit: jest.fn(),
  }),
}));

afterAll(async () => {
  await mongoose.connection.close();
  await redisInstance.getClient().quit();
});

describe("Brevis Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/shorten", () => {
    it("should shorten a valid URL", async () => {
      const mockUrl = {
        shortCode: "abc123",
        originalUrl: "https://example.com",
      };

      (Url.findOne as jest.Mock).mockResolvedValue(null);

      (Url.create as jest.Mock).mockResolvedValue(mockUrl);

      (redisInstance.getClient().set as jest.Mock).mockResolvedValue("OK");

      const response = await request(app)
        .post("/api/v1/shorten")
        .send({ longURL: "https://example.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.shortCode).toBe("abc123");
      expect(response.body.data.originalUrl).toBe("https://example.com");
    });

    it("should return 422 for invalid URL", async () => {
      const response = await request(app)
        .post("/api/v1/shorten")
        .send({ longURL: "invalid-url" });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });

    it("should return 422 for missing URL", async () => {
      const response = await request(app).post("/api/v1/shorten").send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /:code", () => {
    it("should redirect to original URL when short code exists", async () => {
      const mockUrl = "https://example.com";

      (redisInstance.getClient().get as jest.Mock).mockResolvedValue(mockUrl);

      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue({
        shortCode: "abc123",
      });

      const response = await request(app).get("/abc123");

      expect(response.status).toBe(302);
      expect(response.header.location).toBe("https://example.com");
    });

    it("should return 404 for non-existent short code", async () => {
      (redisInstance.getClient().get as jest.Mock).mockResolvedValue(null);

      (Url.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/invalid");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Unable to resolve provided shortcode"
      );
    });
  });
});
