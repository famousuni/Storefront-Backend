#!/bin/bash
set -e

export CONTAINER_ID=$(sudo docker ps -a | grep storefront-backend | head -c12)

docker exec -it $CONTAINER_ID psql -U full_stack_dev -c "create database storefront_dev;"
docker exec -it $CONTAINER_ID psql -U full_stack_dev -c "create database storefront_test;"
docker exec -it $CONTAINER_ID psql -U full_stack_dev -c "grant all privileges on database storefront_dev to full_stack_dev;"
docker exec -it $CONTAINER_ID psql -U full_stack_dev -c "grant all privileges on database storefront_test to full_stack_dev;"


