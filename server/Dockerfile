# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package and lock file
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy generated Prisma Client and compiled code from builder
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Use non-root user for security
USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["node", "dist/main"]
