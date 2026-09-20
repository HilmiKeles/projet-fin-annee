pipeline {
    agent any

    environment {
        REGISTRY      = 'localhost:5000'
        IMAGE_FRONT   = "${REGISTRY}/the-tip-top-frontend"
        IMAGE_BACK    = "${REGISTRY}/the-tip-top-backend"
        TAG           = "${env.BUILD_NUMBER}"
        JENKINS_VOL   = 'jenkins_jenkins_home'
        WORKSPACE_DIR = "/ws/workspace/${JOB_NAME}"
        NODE_IMAGE    = 'node:22-alpine'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Lint') {
            parallel {
                stage('Frontend') {
                    steps {
                        sh """
                            docker run --rm \
                              -v ${JENKINS_VOL}:/ws \
                              -w ${WORKSPACE_DIR}/frontend \
                              ${NODE_IMAGE} sh -c "npm ci && (npm run lint || true)"
                        """
                    }
                }
                stage('Backend') {
                    steps {
                        sh """
                            docker run --rm \
                              -v ${JENKINS_VOL}:/ws \
                              -w ${WORKSPACE_DIR}/backend \
                              ${NODE_IMAGE} npm ci
                        """
                    }
                }
            }
        }

        stage('Tests unitaires') {
            parallel {
                stage('Backend') {
                    steps {
                        sh """
                            docker run --rm \
                              -v ${JENKINS_VOL}:/ws \
                              -w ${WORKSPACE_DIR}/backend \
                              ${NODE_IMAGE} npm test
                        """
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        sh """
                            docker run --rm \
                              -v ${JENKINS_VOL}:/ws \
                              -w ${WORKSPACE_DIR}/frontend \
                              ${NODE_IMAGE} npm test
                        """
                    }
                }
            }
        }

        stage('Optimisation des assets') {
            steps {
                sh """
                    docker run --rm \
                      -v ${JENKINS_VOL}:/ws \
                      -w ${WORKSPACE_DIR}/frontend \
                      ${NODE_IMAGE} npm run build
                """
            }
        }

        stage('Build images Docker') {
            steps {
                sh "docker build -t ${IMAGE_FRONT}:${TAG} -t ${IMAGE_FRONT}:latest ./frontend"
                sh "docker build -t ${IMAGE_BACK}:${TAG} -t ${IMAGE_BACK}:latest ./backend"
            }
        }

        stage('Push vers le registry') {
            steps {
                sh "docker push ${IMAGE_FRONT}:${TAG}"
                sh "docker push ${IMAGE_FRONT}:latest"
                sh "docker push ${IMAGE_BACK}:${TAG}"
                sh "docker push ${IMAGE_BACK}:latest"
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/dist',
                reportFiles: 'index.html',
                reportName: 'Rapport Build Frontend'
            ])
        }
        success {
            echo '✅ Pipeline terminé avec succès'
        }
        failure {
            echo '❌ Pipeline en échec — vérifier les logs'
        }
    }
}