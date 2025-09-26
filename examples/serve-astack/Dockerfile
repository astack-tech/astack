# Multi-stage build for AStack Chat Server
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.0.0

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json ./

# Copy all package.json files
COPY backend/package.json backend/
COPY frontend/package.json frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY backend/ backend/
COPY frontend/ frontend/

# Build applications
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

RUN npm install -g pnpm@8.0.0

WORKDIR /app

# Copy built applications
COPY --from=base /app/backend/dist ./backend/dist
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/backend/package.json ./backend/
COPY --from=base /app/frontend/package.json ./frontend/
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

# Copy necessary frontend static files
COPY --from=base /app/frontend/public ./frontend/public
COPY --from=base /app/frontend/next.config.ts ./frontend/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Start both services
CMD ["pnpm", "start"]