# Magnus 15 Orchestrator - Docker Configuration
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy application code
COPY magnus-orchestrator.js ./

# Create directories for persistence
RUN mkdir -p sessions logs

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run as non-root
RUN addgroup -g 1001 -S magnus && \
    adduser -S magnus -u 1001 && \
    chown -R magnus:magnus /app
USER magnus

# Start application
CMD ["node", "magnus-orchestrator.js"]
