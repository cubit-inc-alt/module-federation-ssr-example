#use node js base image
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# copy package.json and package-lock.json to root directory
COPY package.json  pnpm-lock.yaml* ./

# install pnpm if not already installed
RUN npm install -g pnpm

# install dependencies
RUN pnpm install

# install dependencies for all packages
RUN pnpm recursive install

#copy source code to root directory
COPY . .

#build the app
RUN pnpm run build

EXPOSE 3000 3001 3002

CMD ["pnpm", "serve"]