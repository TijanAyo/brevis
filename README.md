## Brevis URL Shortner Service

A simple and scalable URL shortener service.

### 🚀 Tech Stack

- Node.js & TypeScript
- Express
- MongoDB with Mongoose
- Redis (Caching)
- Pino (Logging)
- Jest & Supertest (Unit & Integration Testing)
- Celebrate/Joi (Validation)
- Docker (optional, for local development)

### 🛠️ Installation

1. Clone the repo

   ```bash
   git clone https://github.com/TijanAyo/brevis.git

   cd brevis
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up env variables

- Copy `.env.example` to `.env` and fill in your MongoDB and Redis connection details

4. (Optional) Start with Docker
   ```bash
    docker-compose up -d # Run in detached mode
   ```

### 🏃 Running the Service

- Development

  ```bash
  npm run start:dev
  ```

- Production
  ```bash
  npm run start
  ```

The service will be available at http://localhost:88 by default.

### 🧪 Running Tests

- Unit and Integration test
  ```bash
    npm run test
  ```
