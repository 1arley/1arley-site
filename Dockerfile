# ==============================================
# Build Stage
# ==============================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY next.config.* ./
COPY postcss.config.* ./
COPY tailwind.config.* ./
COPY components.json ./

RUN npm ci

COPY src ./src
COPY public ./public

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# ==============================================
# Production Stage
# ==============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache wget

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next-build/standalone ./
COPY --from=builder /app/.next-build/static ./.next-build/static


EXPOSE 3000

CMD ["node", "server.js"]
