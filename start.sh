#!/bin/bash

#env
p=9000
develop=true

#Kill port
fuser -k $p/tcp
echo "Port opened: $p"
#Start processes
tsc --watch --project server.tsconfig.json &
nodemon ./server/index.js --port=$p --develop=$develop &
webpack --watch --env.develop $develop --env.port $p