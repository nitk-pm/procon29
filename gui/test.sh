#!/bin/bash

cd $(dirname $0)
yarn install
./node_modules/gulp/bin/gulp.js
