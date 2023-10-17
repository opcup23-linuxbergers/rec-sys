FROM golang:alpine AS build

WORKDIR /src

COPY . /src/

RUN \
    go mod tidy && \
    go mod download && \
    go build -o /out

FROM alpine:latest

WORKDIR /app
COPY --from=build /out /app/out

EXPOSE 5001

ENTRYPOINT [ "/app/out" ]
