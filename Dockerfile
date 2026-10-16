# ==============================================================================
# FINANCIAL IMMUNE SYSTEM (FIS) — ENTERPRISE PRODUCTION CONTAINER
# Multi-Stage Lean Production Image (Compatible with IBM LinuxONE / s390x & x86_64)
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig*.json vite.config.ts postcss.config.js tailwind.config.js ./
RUN npm ci

# Copy application source code
COPY index.html ./
COPY shared ./shared
COPY src ./src
COPY server ./server

# Run strict TypeScript compilation and production Vite bundling
RUN npm run build

# ==============================================================================
# Runtime Stage
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Copy package descriptors and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy built frontend assets and server application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server ./server
COPY tsconfig*.json ./

# Expose standard service port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/health || exit 1

# Start unified production server
CMD ["npm", "start"]
