# Base image
FROM node:20-alpine

# Working directory
WORKDIR /usr/src/app

# Copy dependency files first
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN yarn build

# Expose port
EXPOSE 3000

# Run production server
CMD ["yarn", "start:prod"]