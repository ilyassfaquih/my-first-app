# ============================================
# Stage 1: Build
# ============================================
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy dependency manifests first (for Docker layer caching)
COPY package*.json ./

RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:18-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy dependency manifests and install production-only deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built output from build stage
COPY --from=build /usr/src/app/dist ./dist

# Run as non-root user for security
RUN addgroup -g 1001 -S nestjs && \
    adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
