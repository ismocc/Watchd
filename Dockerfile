# build both apps
FROM node:24-slim AS build
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@12.15.0
WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml backend/
RUN cd backend && pnpm install --frozen-lockfile

COPY movie-tracker/package.json movie-tracker/pnpm-lock.yaml movie-tracker/pnpm-workspace.yaml movie-tracker/
RUN cd movie-tracker && pnpm install --frozen-lockfile

COPY backend backend
COPY movie-tracker movie-tracker
RUN cd backend && pnpm prisma generate && pnpm build
RUN cd movie-tracker && pnpm build

# what actually runs
FROM node:24-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /app/backend/package.json ./
COPY --from=build /app/backend/node_modules node_modules
COPY --from=build /app/backend/prisma prisma
COPY --from=build /app/backend/dist dist
COPY --from=build /app/movie-tracker/dist/movie-tracker/browser public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# update the db tables if theres new migrations, then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
