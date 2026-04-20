FROM node:22-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Gera o Prisma Client durante o build
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copiamos o prisma schema e as migrations para rodar dentro do container, e o baco local (ou mount volume)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dev.db ./dev.db 

EXPOSE 3000
CMD ["node", "server.js"]
