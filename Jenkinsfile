pipeline {
  agent any

  options {
    disableConcurrentBuilds()
  }

  environment {
    IMAGE_API  = 'thetiptop-api'
    IMAGE_WEB  = 'thetiptop-web'
    IMAGE_TAG  = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Backend - Install & Tests') {
      steps {
        dir('backend') { sh 'npm ci' }
      }
    }

    stage('Frontend - Build') {
      steps {
        dir('frontend') { sh 'npm ci && npm run build' }
      }
    }

    stage('Build Docker images') {
      steps {
        sh "docker build -t ${IMAGE_API}:${IMAGE_TAG} ./backend"
        sh "docker build -t ${IMAGE_WEB}:${IMAGE_TAG} ./frontend"
      }
    }
  }

  post {
    success { echo "Build #${env.BUILD_NUMBER} OK – images ${IMAGE_API}:${IMAGE_TAG} et ${IMAGE_WEB}:${IMAGE_TAG} construites." }
    failure { echo "Build #${env.BUILD_NUMBER} échoué – voir les logs ci-dessus." }
  }
}
