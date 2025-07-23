# Build
FROM node:20-alpine3.19 AS builder
WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app/ .

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Comando padrão do container
CMD ["nginx", "-g", "daemon off;"]
