#!/bin/sh

echo "See if you have built the images"

kubectl delete deployment folderservice

kubectl delete deployment fileservice

kubectl delete deployment apigateway

kubectl apply -f folderservice-deployment.yaml

kubectl apply -f fileservice-deployment.yaml

kubectl apply -f apigateway-deployment.yaml
