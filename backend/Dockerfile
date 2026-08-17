FROM node:20-slim
WORKDIR /app

# OpenSSL requis par Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && node src/index.js"]