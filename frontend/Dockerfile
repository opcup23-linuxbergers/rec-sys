FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

EXPOSE 8080

CMD bun .output/server/index.mjs
