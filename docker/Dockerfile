FROM ubuntu:18.04

MAINTAINER "Nakano Masaki <namachan10777@gmail.com>"

RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install gnupg
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install build-essential
RUN apt-get -y install git
RUN apt-get -y install yarn

RUN yarn global add elm

RUN mkdir /ci
WORKDIR /ci
ENTRYPOINT /bin/bash
