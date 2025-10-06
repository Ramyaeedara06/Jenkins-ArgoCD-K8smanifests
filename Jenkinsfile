pipeline{
    agent any
    
    envirnoment{
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
                    set -e
                    git config --global user.email "jenkins@automation"
                    git config --global user.name "Jenkins CI"
                    git clone https://$GIT_USER:$GIT_TOKEN@github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests.git repo
                    cd repo/k8
                    # replace image line (ensure it's unique)
                    sed -i "s|image:.*|image: ${IMAGE}:${BUILD_NUMBER}|" deployment.yaml
                    git add deployment.yaml
                    git commit -m "ci: update image to ${BUILD_NUMBER}"
                    git push https://$GIT_USER:$GIT_TOKEN@github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests.git main
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