
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app-front
COPY --from=build /app/dist /app-front/dist

COPY package.json .
COPY vite.config.ts .
RUN npm install typescript

EXPOSE 80

CMD ["npm", "run", "preview"]
