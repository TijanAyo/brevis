import mongoose from "mongoose";

class Database {
  public async connect() {
    console.log("Database connection should be printed here");
  }

  private async gracefulShutDown() {
    console.log("Shutting down gracefully");

    try {
      await mongoose.connection.close();
    } catch (err: any) {
      console.error(`Error during graceful shutdown: ${err.message}`);
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
