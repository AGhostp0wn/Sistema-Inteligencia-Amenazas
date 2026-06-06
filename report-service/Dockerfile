# ── Stage 1: Build ──────────────────────────────────────────
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copiar go.mod y go.sum primero → cachea go mod download
COPY go.mod go.sum ./
RUN go mod download

# Copiar código fuente
COPY . .

# Compilar binario estático
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o report-service ./cmd/main.go

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM alpine:3.20 AS runtime

WORKDIR /app

# Certificados SSL necesarios para llamadas HTTPS externas
RUN apk add --no-cache ca-certificates

# Usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/report-service .

RUN chown appuser:appgroup report-service
USER appuser

EXPOSE 8090

CMD ["./report-service"]