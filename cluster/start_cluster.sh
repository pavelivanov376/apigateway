docker build -t apigateway:local .
docker build -t folderservice:local ../../Projects/FolderService
docker build -t fileservice:local ../../Projects/fileservice

kubectl apply -f apigateway-deployment.yaml
kubectl apply -f folderservice-db-statefulset.yaml
kubectl apply -f folderservice-deployment.yaml
kubectl apply -f fileservice-db-statefulset.yaml
kubectl apply -f fileservice-deployment.yaml
kubectl apply -f ingress-controller-deployment.yaml

#kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
