# Use official Node.js 22 image as base
FROM node:22-alpine


# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile


# Copy the rest of the app's source code
COPY . .

# Build the app (for NestJS or TypeScript)
RUN yarn build

# Expose the port your app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["yarn", "start:dev"]

