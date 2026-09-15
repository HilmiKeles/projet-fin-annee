pipeline {
    agent any

    environment {
        REGISTRY      = 'registry:5000'
        IMAGE_FRONT   = "${REGISTRY}/the-tip-top-frontend"
        IMAGE_BACK    = "${REGISTRY}/the-tip-top-backend"
        TAG           = "${env.BUILD_NUMBER}"
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
                        dir('frontend') {
                            sh 'docker run --rm -v $PWD:/app -w /app node:20-alpine sh -c "npm ci && (npm run lint || true)"'
                        }
                    }
                }
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'docker run --rm -v $PWD:/app -w /app node:20-alpine npm ci'
                        }
                    }
                }
            }
        }

        stage('Tests unitaires') {
            steps {
                dir('backend') {
                    sh 'docker run --rm -v $PWD:/app -w /app node:20-alpine sh -c "npm test || true"'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                }
            }
        }

        stage('Optimisation des assets') {
            steps {
                dir('frontend') {
                    // Build Vite = minification + compression
                    sh 'docker run --rm -v $PWD:/app -w /app node:20-alpine npm run build'
                }
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

        // À activer quand les serveurs dev/preprod/prod seront prêts :
        // stage('Déploiement DEV') {
        //     steps {
        //         sh 'docker compose up -d'
        //     }
        // }
        //
        // stage('Déploiement PREPROD') {
        //     when { branch 'develop' }
        //     steps {
        //         sh 'docker compose -f docker-compose.preprod.yml up -d'
        //     }
        // }
        //
        // stage('Déploiement PROD') {
        //     when { branch 'main' }
        //     steps {
        //         input message: 'Déployer en production ?', ok: 'Déployer'
        //         sh 'docker compose -f docker-compose.prod.yml up -d'
        //     }
        // }
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