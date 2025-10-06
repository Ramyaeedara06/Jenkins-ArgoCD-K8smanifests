pipeline{
    agent any
    
    environment {
        IMAGE = "ramyaeedara015/jenkins-argocd-sampleapp"
        REPO_URL="https://github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests"
    }
    stages{
        stage('checkout code'){
            steps{
                git branch: 'main', url: "${REPO_URL}"
            }
        }
        stage('Build Docker Image'){
            steps{
                sh 'docker build -t $IMAGE:$BUILD_NUMBER .'
            }
        }
        stage('Docker login & Push'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE:$BUILD_NUMBER'
                }    
            }
        }
        stage('Update k8/'){
            steps {
                withCredentials([usernamePassword(credentialsId: 'git-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                    set -euo pipefail
                    git config --global user.email "jenkins@automation"
                    git config --global user.name "Jenkins CI"

                    # clone fresh into workspace/repo to avoid messing workspace copy
                    rm -rf repo || true
                    git clone https://$GIT_USER:$GIT_TOKEN@github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests.git repo
                    cd repo/k8
                    # Update image line in deployment.yaml
                    sed -i "s|image:.*|image: ${IMAGE}:${BUILD_NUMBER}|" deployment.yaml
                    # Only commit & push if something changed
                    if git diff --quiet -- deployment.yaml; then
                      echo "No change to deployment.yaml; skipping commit/push."
                    else
                      git add deployment.yaml
                      git commit -m "ci: update image to ${BUILD_NUMBER}"
                      # push via token-authenticated URL (Jenkins masks token in logs)
                      git push https://$GIT_USER:$GIT_TOKEN@github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests.git main
                    fi
                    '''
                }
            }
        }
    }
    post{
        success {echo "Pipeline success"}
        failure {echo "Pipeline failed, checked the logs"}
    }
}
