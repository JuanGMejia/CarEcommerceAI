# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm run build

# Runtime Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built Angular app
COPY --from=builder /app/dist/CarUI .   # Replace with actual app name
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Entrypoint will inject runtime-config.js
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
