FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn --frozen-lockfile

COPY . /app

RUN yarn build
CMD yarn start