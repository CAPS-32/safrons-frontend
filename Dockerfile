# Step 1: Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package lock and configurations
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# Step 2: Production stage (Serve via Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
