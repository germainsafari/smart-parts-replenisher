# ---- Build Stage ----
# This stage builds the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . ./
RUN npm run build

# ---- Production Stage ----
# This stage serves the built app using Nginx
FROM nginx:1.23-alpine

# Copy built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 