FROM node:20-alpine AS base

FROM base AS dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]