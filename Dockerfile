# Base image — lightweight Node version
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package file first (for better layer caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .


RUN npx prisma generate
# Build your NestJS project (compiles TypeScript to JavaScript)
RUN npm run build

# Expose the port your app will listen on (matches compose port)
EXPOSE 3000

# Default command to run your app
CMD ["npm", "run", "start:prod"]
