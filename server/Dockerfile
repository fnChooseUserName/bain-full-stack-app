# Use Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
