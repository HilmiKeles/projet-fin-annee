pipeline {
    agent any

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    environment {
        BACKEND_IMAGE  = 'thetiptop-backend'
        FRONTEND_IMAGE = 'thetiptop-frontend'
        IMAGE_TAG      = "${env.BRANCH_NAME ?: 'dev'}-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Install & Tests') {
            steps {
                dir('backend') {
                    sh '''
                        node --version
                        npm --version
                        npm ci
                        if npm run | grep -q "test"; then
                            npm test
                        else
                            echo "Aucun test defini pour le backend (etape ignoree)"
                        fi
                    '''
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('frontend') {
                    sh '''
                        node --version
                        npm --version
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Build images Docker') {
            steps {
                sh """
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                """
            }
        }

        stage('Deploiement') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo "Deploiement de la branche ${env.BRANCH_NAME}"
                sh '''
                    docker compose down || true
                    docker compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline termine avec succes (${env.BRANCH_NAME})"
        }
        failure {
            echo "Pipeline en echec - consulter les logs"
        }
        always {
            cleanWs()
        }
    }
}
