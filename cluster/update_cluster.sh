#!/bin/sh

# incorporate changes to the cluster by deleting and reapplying the deployments

kubectl delete deployment folderservice

kubectl delete deployment fileservice

kubectl delete deployment apigateway

kubectl apply -f folderservice-deployment.yaml

kubectl apply -f fileservice-deployment.yaml

kubectl apply -f apigateway-deployment.yaml
