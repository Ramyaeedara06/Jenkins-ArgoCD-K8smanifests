pipeline {
  agent any
  environment {
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    SONAR_SERVER = 'http://sonarqube:9000' // or SonarQube URL
    SONAR_CRED = 'sonar-token-id' // Jenkins credential ID (Secret Text)
    DOCKER_CRED = 'dockerhub-cred' // Jenkins Docker registry credential (username/password)
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'npm --prefix app ci'
      }
    }
    stage('Unit Test') {
      steps {
        sh 'npm --prefix app test'
      }
    }
    stage('Static Code Analysis - SonarQube') {
      environment {
        // SONAR login injected from credentials
      }
      steps {
        withCredentials([string(credentialsId: env.SONAR_CRED, variable: 'SONAR_TOKEN')]) {
          sh ''
          '
          sonar - scanner\ -
            Dsonar.projectKey = cicd - demo\ -
            Dsonar.sources = app\ -
            Dsonar.host.url = $ {
              SONAR_SERVER
            }\ -
            Dsonar.login = $ {
              SONAR_TOKEN
            }
          ''
          '
        }
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
        }
      }
    }
    stage('Security Scan - Trivy') {
      steps {
        // using trivy in docker to scan image
        sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 1 --severity HIGH,CRITICAL ${IMAGE_NAME}:${IMAGE_TAG} || true"
        // optionally fail build on findings by removing '|| true'
      }
    }
    stage('Push to Registry') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CRED, passwordVariable: 'PW', usernameVariable: 'UN')]) {
          sh "echo $PW | docker login -u $UN --password-stdin ${DOCKER_REGISTRY}"
          sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
        }
      }
    }
    stage('Trigger GitOps - update k8s manifests') {
      steps {
        sh ''
        '
        # Update image tag in k8s repo and push - simple example using sed
        git clone https://github.com/Ramyaeedara06/Jenkins-ArgoCD-K8smanifests
          cd k8 
        sed - i 's|image: .*|image: ${IMAGE_NAME}:${IMAGE_TAG}|'
        deployment.yaml
        git add. && git commit - m "chore: update image to ${IMAGE_TAG}" || true
        git push origin main
          ''
        '
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}