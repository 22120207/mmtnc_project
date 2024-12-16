pipeline {
    agent {
        label '22120207'
    }

    environment {
        PROJECT_NAME = 'mmtnc_project'
        PROJECT_PATH = "${WORKSPACE}"
        PROJECT_PORT = '3000'
        USERNAME = '22120207'
        REGISTRY_NAME = "tienminhktvn2"
        DOCKERHUB_CREDENTIALS = credentials('tienminhktvn2-dockerhub')
        IMAGE_VERSION =  "${REGISTRY_NAME}/${PROJECT_NAME}_${JOB_NAME}:${BUILD_ID}"
        GIT_URL = "https://github.com/${USERNAME}/${PROJECT_NAME}.git"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    sh "git clone ${GIT_URL}"
                }
            }
        }

        stage('Build Image') {
            steps {
                script {
                    sh "cd ${PROJECT_PATH}"
                    sh "docker build -t ${IMAGE_VERSION} ."
                }
            }
        }

        stage('Login') {
            steps {
                script {
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    sh "docker push ${IMAGE_VERSION}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "docker rm -f ${PROJECT_NAME}"
                    sh "docker run --rm -dp ${PROJECT_PORT}:${PROJECT_PORT} --name ${PROJECT_NAME} ${IMAGE_VERSION}"
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}