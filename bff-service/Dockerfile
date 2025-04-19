# Stage 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy compiled files from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install dependencies and remove unnecessary files
RUN npm ci --production && npm prune --production && rm -rf /tmp/* ~/.npm

EXPOSE 8080

CMD ["node", "dist/main.js"]
