# ── Stage 1: Build ──────────────────────────────────────────
FROM python:3.12-alpine AS builder

WORKDIR /app

# Instalar dependencias de compilación
RUN apk add --no-cache gcc musl-dev libffi-dev

# Copiar solo requirements primero → cachea pip install
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM python:3.12-alpine AS runtime

WORKDIR /app

# Copiar dependencias ya instaladas desde el builder
COPY --from=builder /install /usr/local

# Usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar código fuente
COPY app ./app

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]