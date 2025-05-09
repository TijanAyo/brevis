ARG NODE_VERSION=20

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Prod stage
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

COPY package*.json ./

#Install only prod dependency
RUN npm install --omit=dev

# Copy only the necessary artifacts from the builder stage
COPY --from=builder /app/dist ./

EXPOSE 3000

CMD [ "node", "index.js" ]