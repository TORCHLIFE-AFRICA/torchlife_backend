FROM node:20-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache curl postgresql-client redis
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
RUN yarn install --immutable
COPY . .
RUN chmod +x scripts/*.sh
RUN npx prisma generate
RUN yarn build
EXPOSE 3000
CMD ["./scripts/start.sh", "node", "dist/main.js"]
