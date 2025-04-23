import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import "./config/db";
import { shortUrlRoute } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const port = Number(process.env.PORT) || 88;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(["/api/v1", "/brevis/v1"], shortUrlRoute);

app.get("/health", (_req: Request, res: Response) => {
  return res.json({
    message: `Server up and running`,
    success: true,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
