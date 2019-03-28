#############
# BUILD IMAGE
#############
FROM node:8.15.1-jessie AS build-cra

RUN mkdir -p /app
WORKDIR /app

ADD package.json ./
ADD yarn.lock ./

RUN yarn

ADD ./public ./public/
ADD ./scripts ./scripts/
ADD ./src ./src/
ADD .eslintignore ./
ADD .eslintrc ./
ADD .gitignore ./
ADD README.md ./

ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_ENTRY_POINT_IDENTIFIER

ENV REACT_APP_GRAPHQL_URL=${REACT_APP_GRAPHQL_URL}
ENV REACT_APP_ENTRY_POINT_IDENTIFIER=${REACT_APP_ENTRY_POINT_IDENTIFIER}

RUN yarn build

#############
# FINAL IMAGE
#############
FROM nginx:alpine

COPY --from=build-cra /app/build/ /usr/share/nginx/html/
