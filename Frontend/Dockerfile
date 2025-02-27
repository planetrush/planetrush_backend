# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules && \
    rm -f package-lock.json && \
    npm install

# Copy the rest of the application code
COPY . . 

# Copy .env file if it exists
COPY .env ./.env

# Build the Vite application
RUN npm run build

# RUN rm ./.env

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
