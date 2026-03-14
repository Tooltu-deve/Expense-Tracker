# CI/CD Setup Guide

This document describes how to configure and use the CI/CD pipeline for the Expense Tracker project.

## Overview

- **CI:** GitHub Actions – test, build Docker images, push to Docker Hub (tags = commit SHA)
- **CD:** ArgoCD – syncs from a separate manifests repo to Kubernetes (Minikube)

## Prerequisites

- GitHub repo with the app code
- Separate GitHub repo `expense-tracker-manifests` (push the `expense-tracker-manifests/` folder)
- Docker Hub account
- Minikube with kubectl
- ArgoCD installed on Minikube

## 1. GitHub Secrets (App Repo)

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (or password) |
| `MANIFESTS_REPO_TOKEN` | GitHub PAT with `repo` scope (to push to manifests repo) |

## 2. Push Manifests to Separate Repo

1. Create a new repo `expense-tracker-manifests` on GitHub.
2. Push the contents of `expense-tracker-manifests/`:

```bash
cd expense-tracker-manifests
git init
git add .
git commit -m "Initial manifests"
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker-manifests.git
git branch -M main
git push -u origin main
```

3. Update `argocd/application.yaml`: replace `REPLACE_OWNER` with your GitHub username.

## 3. Create Secrets on Minikube

Before deploying, create real secrets (do not use placeholders in production):

```bash
kubectl create namespace expense-tracker

# MySQL secret
kubectl create secret generic mysql-secret -n expense-tracker \
  --from-literal=root-password=YOUR_ROOT_PASSWORD \
  --from-literal=password=YOUR_EXPENSE_USER_PASSWORD

# Backend secret (DB_PASSWORD must match mysql-secret password)
kubectl create secret generic backend-secret -n expense-tracker \
  --from-literal=DB_PASSWORD=YOUR_EXPENSE_USER_PASSWORD \
  --from-literal=JWT_SECRET=your-jwt-secret-at-least-32-chars
```

After creating these, delete the placeholder secrets from the repo or let Kustomize apply (they will be overwritten if you keep the base secrets – remove `mysql/secret.yaml` and `backend/secret.yaml` from base if managing secrets separately).

## 4. Install ArgoCD on Minikube

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

Enable Ingress addon:
```bash
minikube addons enable ingress
```

## 5. Apply ArgoCD Application

```bash
kubectl apply -f expense-tracker-manifests/argocd/application.yaml
```

Ensure `repoURL` in `argocd/application.yaml` points to your manifests repo.

## 6. Pipeline Flow

1. **Push to main** → GitHub Actions runs:
   - `test`: backend + frontend tests
   - `build-and-push`: build images, tag with `${{ github.sha }}`, push to Docker Hub
   - `update-manifests`: clone manifests repo, update image tags in `overlays/minikube/kustomization.yaml`, commit & push

2. **ArgoCD** detects change in manifests repo → syncs to Minikube

## Accessing the App

After Ingress is ready:
```bash
minikube addons enable ingress
# Add expense.local to /etc/hosts pointing to minikube ip
# Or use: minikube tunnel
```

Then open `http://expense.local` (or the host configured in Ingress).
