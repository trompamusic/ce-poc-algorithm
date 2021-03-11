###############
# BUILD VEROVIO
###############

FROM buildpack-deps:stretch AS build-env

ARG VEROVIO_VERSION=2.0.2

WORKDIR /usr
RUN apt-get update && apt-get install -y git cmake build-essential && git clone https://github.com/rism-ch/verovio.git && cd verovio && git checkout tags/version-$VEROVIO_VERSION -b version-$VEROVIO_VERSION
WORKDIR /usr/verovio/tools
RUN cmake . && make && make install/strip

#############
# FINAL IMAGE
#############
FROM node:14-buster

COPY --from=build-env /usr/local/bin/verovio /usr/local/bin/verovio
COPY --from=build-env /usr/local/share/verovio /usr/local/share/verovio

RUN mkdir -p /app
WORKDIR /app

ADD .babelrc /app/
ADD package.json /app/
ADD yarn.lock /app/

RUN yarn

ADD ./src/ ./src/
ADD ./tmp/ ./tmp/

RUN yarn build
RUN chmod +x /usr/local/bin/verovio /usr/local/share/verovio

CMD ["yarn", "serve"]
