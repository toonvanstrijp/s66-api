#!/bin/bash

if type minikube 2> /dev/null; then
  eval $(minikube docker-env -p s66)
fi

# Get root path
ROOT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )/..

docker_name="api"

LATEST_IMAGE_NAME=$docker_name:latest
LATEST_DOCKER_ID=$(docker images --no-trunc -q ${LATEST_IMAGE_NAME})

echo "Depling image api:${LATEST_DOCKER_ID:7:16}"

kubectl set image deployment/api api=api:${LATEST_DOCKER_ID:7:16}

if type minikube 2> /dev/null; then
  eval $(minikube docker-env -p s66 -u)
fi