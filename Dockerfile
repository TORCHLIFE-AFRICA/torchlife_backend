FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

# Install all deps
RUN yarn install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN yarn build

EXPOSE 3000

# Always run production mode
CMD ["yarn", "start:prod"]