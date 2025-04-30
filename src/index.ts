import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import compression from "compression";
import "./config/db";
import "./config/redis";
import { shortUrlRoute, unshortenRoute } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";
import requestLogger from "./middleware/requestLogger";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = Number(process.env.PORT) || 88;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
    message: "Rate limit exceeded",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(compression());
app.use(limiter);

app.use(["/api/v1", "/brevis/v1"], shortUrlRoute);

app.get("/", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message:
      "Brevis URL Shortener Service -- Visit /api/v1/shorten or /brevis/v1/shorten to shorten URLs",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Server up and running",
  });
});

app.use("/", unshortenRoute);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
