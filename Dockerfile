#FROM node:10-alpine as builder
FROM node:10 as builder

WORKDIR /app

COPY package.json yarn.lock ./

#RUN apk --no-cache add --virtual native-deps \
#  g++ gcc libgcc libstdc++ linux-headers make python && \
#  npm install --quiet node-gyp -g &&\
#  npm install --quiet && \
#  apk del native-deps


RUN yarn install

ADD public ./public
ADD src ./src
ADD config-overrides.js ./

ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV

RUN yarn build

FROM nginx:1.17-alpine

ADD config/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build/ /var/www/html

EXPOSE 80
