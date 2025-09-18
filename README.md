# Cloud Storage App Technical Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [API Gateway](#api-gateway)
4. [Fileservice](#fileservice)
5. [Folderservice](#folderservice)
6. [User Interface](#user-interface)
7. [Setup](#setup)
8. [Deployment](#deployment)
9. [Kubernetes Cluster](#kubernetes-cluster)
10. [CI/CD](#cicd)
11. [Logging and Monitoring](#logging-and-monitoring)
12. [Testing](#testing)


## Introduction
The Cloud Storage App is a web application that allows users to upload, store, and manage their files in the cloud.


## Architecture
The application is built using a microservices architecture, consisting of the following components:
- API Gateway
- Fileservice
- Folderservice
    
The User Interface (UI) is part of the frontend repository
The application is deployed on a Kubernetes cluster and uses Docker for containerization.

## API Gateway
The API Gateway serves as the entry point for all client requests. It routes requests to the appropriate microservice (Fileservice or Folderservice) based on the request path.
It uses Spring Cloud Gateway for routing and load balancing.

## Fileservice
The Fileservice is responsible for handling file-related operations such as uploading, downloading, and deleting files.
It is built using Spring Boot and exposes RESTful APIs for file management.
Files themselvse are stored in a postgreSQL database currently, in the previous version of the app they were stored in AWS S3 and will be again in the future.

## Folderservice
The Folderservice manages folder-related operations, including creating, renaming, and deleting folders.
It is also built using Spring Boot and provides RESTful APIs for folder management.
Folder metadata is stored in a PostgreSQL database.

## User Interface
The User Interface (UI) is a web application that allows users to interact with the Cloud Storage App.
It is built using React and communicates with the API Gateway to perform file and folder operations.

## Setup
To set up the development environment, clone each repository (API Gateway, Fileservice, Folderservice) in one parent directory. Then run the start_cluster.sh script to start a local Kubernetes cluster.
I use Docker Desktop with enabled Kubernetes for local development.

## Deployment
There is a build_inamge.sh in each repo as well as a resource yaml file for deploying the services to a Kubernetes cluster.
The build_image.sh script builds a Docker image for the service and stores it locally for now, but in the future the images will be pushed in Docker Hub.
The resource yaml file contains the necessary Kubernetes resources (Deployment, Service) for deploying the service.

## Kubernetes Cluster

For each service application there is a resource yaml file that contains the necessary Kubernetes resources described:
 - Deployment: One replica for now
 - Service: ClusterIP type for internal communication between services
 - ConfigMap: For storing configuration properties (Disabled for now)
 - Secret: For storing sensitive information such as database credentials (Disabled for now)
 - PersistentVolumeClaim: For storing persistent data for the DB pods

Also, one Ingress is deployed to expose the API Gateway service to external traffic.

## CI/CD
TODO add Github Actions workflows or Jenkins pipelines for automating the build, test, and deployment processes.

## Logging and Monitoring
TODO integrate logging and monitoring tools such as ELK stack or Prometheus and Grafana

## Testing
Unit and integration tests will be implemented for each microservice using JUnit and Mockito.
End-to-end tests for the entire application will be implemented using tools like Selenium or Cypress.
