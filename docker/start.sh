#!/bin/sh
set -e

# Script to start PocketBase and nginx parallelly in same container

# Start PocketBase bound to localhost only
pocketbase serve --http=127.0.0.1:8090 --dir /data --publicDir /usr/share/nginx/html &
PB_PID=$!

# Start nginx in foreground
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait on both and exit if either dies
wait -n $PB_PID $NGINX_PID
exit $?
