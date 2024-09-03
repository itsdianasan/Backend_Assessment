# Stage 1: Build Stage
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production Stage
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy only the compiled files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json and package-lock.json (for production dependencies)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "dist/index.js"]
