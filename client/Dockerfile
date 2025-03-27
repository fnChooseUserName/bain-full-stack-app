# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend code and build
COPY . .
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Serve the app
CMD ["npm", "run", "preview", "--", "--host"]
