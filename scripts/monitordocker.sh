#!/bin/bash

docker kill logspout || true
docker rm logspout || true

docker run -d --name="logspout" \
	--volume=/var/run/docker.sock:/var/run/docker.sock \
	--publish=127.0.0.1:8000:80 \
	--network basicnetwork_basic \
	gliderlabs/logspout  

curl http://127.0.0.1:8000/logs
    
# https://github.com/gliderlabs/logspout/tree/master/httpstream