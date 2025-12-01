# Multi-stage build for ARM64 (AWS Bedrock requirement)
# MUST build from astack root directory:
# cd /Users/archer/a-github/astack && docker build --platform linux/arm64 -f examples/agent-in-aws-bedrock-agent-core/Dockerfile -t IMAGE_NAME .

FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace files from root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY packages ./packages
COPY examples/agent-in-aws-bedrock-agent-core ./examples/agent-in-aws-bedrock-agent-core

# Install pnpm and dependencies
RUN corepack enable pnpm && \
    pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

# Build all packages then the example
RUN pnpm build && \
    cd examples/agent-in-aws-bedrock-agent-core && \
    pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy workspace structure to maintain proper module resolution
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/examples/agent-in-aws-bedrock-agent-core ./examples/agent-in-aws-bedrock-agent-core

# Set working directory to the example
WORKDIR /app/examples/agent-in-aws-bedrock-agent-core

# Expose port 8080
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run server
CMD ["node", "dist/server.js"]
