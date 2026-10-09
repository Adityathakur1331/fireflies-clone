FROM node:20-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV BACKEND_URL=http://127.0.0.1:8000
RUN npm run build && npm prune --omit=dev

FROM python:3.12-slim-bookworm
WORKDIR /app

# Node.js runtime (final image is Python-only; `next start` needs node + npm)
COPY --from=frontend-build /usr/local/bin/node /usr/local/bin/node
COPY --from=frontend-build /usr/local/bin/npm /usr/local/bin/npm
COPY --from=frontend-build /usr/local/bin/npx /usr/local/bin/npx
COPY --from=frontend-build /usr/local/lib/node_modules /usr/local/lib/node_modules

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend ./frontend
COPY scripts/docker-start.sh /app/scripts/docker-start.sh
RUN chmod +x /app/scripts/docker-start.sh

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["/app/scripts/docker-start.sh"]
