# Front-End
- This service is an Angular CRUD, with Node.js and Express.js as a Web Server, Cloud Datastore and Cloud Storage as Database.

# Execution
- npm start (ng build --prod && node server.js)

# TEST: Karma - Jasmien (BDD)
- npm test

# Deploy: Flexible Environment
- gcloud app deploy

# Create Docker Container Image
- gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/frontendflex-container

# Create Cluster (Kubernetes Engine)
- gcloud container clusters create frontendflex-cluster --num-nodes 1 --enable-basic-auth --issue-client-certificate --zone $YOUR_ZONE

# Deploy Docker Container Image on a Google Kubernetes Engine (GKE)
- kubectl apply -f deployment.yaml
- Check: kubectl get deployments
- Check: kubectl get pods
- Check: kubectl logs $POD_NAME
- kubectl apply -f service.yaml
- Check kubectl get services

## License
[MIT](https://choosealicense.com/licenses/mit/)