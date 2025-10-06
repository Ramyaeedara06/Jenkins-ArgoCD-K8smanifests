Jenkins builds image, pushes to Docker Hub, updates k8/deployment.yaml in SAME repo, ArgoCD auto-syncs → new pods deployed.

Summary:

Jenkins builds image and pushes to Docker Hub.

Jenkins updates k8/deployment.yaml image tag inside the same repo and pushes commit.

ArgoCD detects the commit (same repo, path k8) and auto-syncs.

App deployment updated; service is ClusterIP (internal).

For testing use kubectl port-forward or install Ingress to expose external URL.