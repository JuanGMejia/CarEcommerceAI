#!/bin/sh
echo "window.__env = {
  CLIENT_ID: '${CLIENT_ID}',
  TENANT_ID: '${TENANT_ID}'
};" > /usr/share/nginx/html/assets/runtime-config.js

nginx -g "daemon off;"
