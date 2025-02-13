#use node js base image
FROM node:23-alpine AS builder

# set working directory
WORKDIR /app

# copy package.json and package-lock.json to root directory
COPY package.json  pnpm-lock.yaml* ./

# install pnpm if not already installed
RUN npm install -g pnpm

# install dependencies
RUN pnpm -r install



#copy source code to root directory
COPY . .

#build the app
RUN pnpm run build

EXPOSE 3000 3001 3002

CMD ["pnpm", "serve"]