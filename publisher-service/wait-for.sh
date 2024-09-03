#!/bin/sh

# Wait for the express-service to be up by continuously checking the health endpoint.
while ! curl -s http://express-service:3000/ > /dev/null; do
  echo "Waiting for express-service to be ready..."
  sleep 5
done

echo "express-service is up! Starting publisher service."
exec "$@"
