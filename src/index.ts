import app from "./app";
import logger from "./utils/logger";

const port = Number(process.env.PORT) || 88;

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
