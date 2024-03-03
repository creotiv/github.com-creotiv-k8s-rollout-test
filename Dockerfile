FROM golang:1.22-alpine as builder
WORKDIR /app
COPY go.mod ./
COPY . .
RUN go build -o server .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
