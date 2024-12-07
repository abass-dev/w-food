# Use Node 20 Alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install git and other necessary tools
RUN apk add --no-cache git

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy package.json and package-lock.json (if available)
COPY --chown=appuser:appgroup package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=appuser:appgroup . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

