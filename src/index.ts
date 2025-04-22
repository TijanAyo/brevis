import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import "./config/db";

const app = express();
const port = Number(process.env.PORT) || 88;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  return res.json({
    message: `Server up and running`,
    success: true,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
