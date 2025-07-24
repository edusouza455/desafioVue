FROM node:20-alpine3.19 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run generate

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
