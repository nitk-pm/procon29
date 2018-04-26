FROM ubuntu:18.04

MAINTAINER "Nakano Masaki <namachan10777@gmail.com>"

RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install build-essential
RUN apt-get -y install git
RUN apt-get -y install yarn

RUN mkdir /ci
ENTRYPOINT /bin/bash
