FROM node:18-alpine

# Configurações de segurança
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copia apenas o necessário para instalação
COPY package*.json ./

# Instala dependências
RUN npm ci --only=production && \
    npm cache clean --force

# Copia o restante do app
COPY --chown=app:app . .

# Configurações finais
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1
CMD ["node", "src/app.js"]