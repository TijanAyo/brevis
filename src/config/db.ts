import mongoose from "mongoose";
import logger from "../utils/logger";

class Database {
  private IsLocal = process.env.NODE_ENV === "development";
  private MONGO_URI = this.IsLocal
    ? String(process.env.LOCAL_MONGO_URI) ||
      "mongodb://root:password@localhost:27017/brevis-db?authSource=admin"
    : String(process.env.MONGO_URI);

  public async connect() {
    const connMsg = this.IsLocal ? "Local 🛠️🛠️" : "Prod";
    try {
      await mongoose.connect(this.MONGO_URI!);
      logger.info(`Connected to MongoDB ${connMsg}`);
    } catch (err: any) {
      logger.error(`Error connecting to MongoDB: ${err.message}`);
    }
  }

  private async gracefulShutDown() {
    logger.warn("Shutting down gracefully");

    try {
      await mongoose.connection.close();
    } catch (err: any) {
      logger.error(`Error during graceful shutdown: ${err.message}`);
    } finally {
      process.exit(0);
    }
  }

  public async handleShutDownSignals() {
    process.on("SIGINT", this.gracefulShutDown);
    process.on("SIGTERM", this.gracefulShutDown);
  }
}

const database = new Database();
database.connect();
database.handleShutDownSignals();

export default database;
