# Build Stage
FROM node:24-alpine3.22 AS builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build

# Runtime Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built Angular app
COPY --from=builder /app/dist/CarUI/browser .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Entrypoint will inject runtime-config.js
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
