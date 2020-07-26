# Option 1
# Create Cluster (Kubernetes Engine)
- gcloud container clusters create appflex-cluster --num-nodes 3 --enable-basic-auth --issue-client-certificate --zone $YOUR_ZONE us-east1-b

# Deploy Docker Container (back-end and front-end) Image on a Google Kubernetes Engine (GKE)
- Check: Containers back-end and front-end must existed.
- kubectl apply -f deployment.yaml
- Check: kubectl get deployments
- Check: kubectl get pods
- Check: kubectl logs $POD_NAME
- kubectl apply -f service.yaml
- Check: kubectl get services

# Option 2 (Cloud Run)
- gcloud builds submit

## License
[MIT](https://choosealicense.com/licenses/mit/)