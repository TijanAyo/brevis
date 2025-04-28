import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import compression from "compression";
import "./config/db";
import "./config/redis";
import { shortUrlRoute } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";
import requestLogger from "./middleware/requestLogger";

const app = express();
const port = Number(process.env.PORT) || 88;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(compression());

app.use(["/api/v1", "/brevis/v1"], shortUrlRoute);

app.get("/health", (_req: Request, res: Response) => {
  return res.json({
    message: `Server up and running`,
    success: true,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
