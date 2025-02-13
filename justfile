set dotenv-load

default:
    @just --list

tag:= "$(git rev-parse --short HEAD)"

namespace:= "federation-ssr-template"
imageRepo:= "ghcr.io/cubit-inc-alt/federation-ssr-template"
chart-name:= "federation-ssr-template"
helm-path:= "./helm/frontend"

## config for the deployer service account
service-account-name:= "federation-ssr-deployer"
service-account-chart-name:= "federation-ssr-deployer"
service-account-helm-path:= "./helm/service-account"

# Builds and pushes the docker image
build-push-image imageTag=tag:
    #!/usr/bin/env sh
    docker build -t {{imageRepo}}:latest -t {{imageRepo}}:{{tag}} .
    docker image push --all-tags {{imageRepo}}

# Creates the namespace
ns-create:
    kubectl create namespace {{ namespace }}

# Deletes the namespace
ns-delete:
    kubectl delete namespace {{ namespace }}

# Runs helm upgrade
helm-upgrade imageTag=tag:
    #!/usr/bin/env sh
    echo "Deploying {{imageRepo}}:{{imageTag}} to $(kubectl config current-context)"
    helm upgrade {{chart-name}} --create-namespace \
        --install --namespace {{namespace}} {{helm-path}} \
        --set namespace={{namespace}} \
        --set image.tag={{imageTag}} \
        --set image.repository={{imageRepo}} \
        --set dockerConfigJson=$DOCKER_CONFIG_JSON 

# Uninstalls the helm chart
helm-delete:
    helm uninstall -n {{namespace}} {{chart-name}}

# creates a service account and token for a deployer
create-deployer:
    echo "Creating deployer service account to $(kubectl config current-context)"
    helm install {{service-account-chart-name}} {{service-account-helm-path}} \
        --namespace {{namespace}}  --create-namespace \
        --set serviceAccountName={{service-account-name}} \
        --set namespace={{namespace}}

# deletes the deployer service account
delete-deployer:
    echo "Deleting deployer service account to $(kubectl config current-context)"
    helm uninstall {{service-account-chart-name}} --namespace {{namespace}}

# gets the deployer kubeconfig
deployer-cubeconfig:
    #!/usr/bin/env sh
    CLUSTER_NAME=$(kubectl config current-context)
    SECRET_NAME="sa-{{service-account-name}}-token"
    SA_TOKEN=$(kubectl get secret $SECRET_NAME -n {{namespace}}  -o jsonpath='{.data.token}' | base64 -D)
    CA_DATA=$(kubectl get secret $SECRET_NAME -n {{namespace}} -o jsonpath='{.data.ca\.crt}')
    K8S_ENDPOINT=$(kubectl config view -o jsonpath="{.clusters[?(@.name=='${CLUSTER_NAME}')].cluster.server}")
    echo "
    apiVersion: v1
    kind: Config
    clusters:
      - name: default-cluster
        cluster:
          certificate-authority-data: ${CA_DATA}
          server: ${K8S_ENDPOINT}
    contexts:
    - name: default-context
      context:
        cluster: default-cluster
        namespace: {{namespace}}
        user: default-user
    current-context: default-context
    users:
    - name: default-user
      user:
        token: ${SA_TOKEN}
    "

