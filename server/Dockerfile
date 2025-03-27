# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Set database host name explicitly
ENV PGHOST=database

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the server source code
COPY . .

# Expose backend port
EXPOSE 4000

# Run migrations on startup and then start the server
CMD ["sh", "-c", "npx node-pg-migrate up && npm start"]
