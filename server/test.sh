#!/bin/bash

cd $(dirname $0)
dub test --compiler=ldc2
dub test --compiler=dmd