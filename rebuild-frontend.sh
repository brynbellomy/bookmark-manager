#!/bin/bash

rm -rf assets && \
pushd frontend && \
yarn build && \
mv build ../assets && \
popd && \
go-bindata-assetfs ./assets/...
