docker build -t apigateway:local .
docker build -t apigateway:local ./Projects/FolderService
docker build -t apigateway:local ./Projects/fileservice

kubectl apply -f apigateway.yaml
kubectl apply -f ../FolderService/folderservice.yaml     // TODO: check the .yaml names
kubectl apply -f ../fileservice/fileservice.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

# This will build and save the images locally and run the cluster with them