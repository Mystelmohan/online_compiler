# Use official Node.js image
FROM node:18

# Create and set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the project files
COPY . .

# Expose the port your server listens to
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
