# Base image — lightweight Node version
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package and lock files first (for better layer caching)
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy the rest of the app source code
COPY . .

# Build your NestJS project (compiles TypeScript to JavaScript)
RUN yarn build

# Expose the port your app will listen on (matches compose port)
EXPOSE 3000

# Default command to run your app
CMD ["yarn", "start:prod"]
