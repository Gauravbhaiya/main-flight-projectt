pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'gauravbhaiya'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build - Service Registry') {
            steps {
                dir('FlightBooking-mainn/service-registry') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build - Profile Service') {
            steps {
                dir('FlightBooking-mainn/profilemanagement-service') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build - Flight Service') {
            steps {
                dir('FlightBooking-mainn/flight-and-search-service') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build - Booking Service') {
            steps {
                dir('FlightBooking-mainn/booking-service') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build - Fare Service') {
            steps {
                dir('FlightBooking-mainn/fare-service') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Build - API Gateway') {
            steps {
                dir('FlightBooking-mainn/api-gateway') {
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"

                        def services = [
                            'service-registry',
                            'profilemanagement-service',
                            'flight-and-search-service',
                            'booking-service',
                            'fare-service',
                            'api-gateway'
                        ]

                        services.each { service ->
                            bat "docker build -t %DOCKER_HUB_USER%/${service}:${IMAGE_TAG} FlightBooking-mainn/${service}"
                            bat "docker push %DOCKER_HUB_USER%/${service}:${IMAGE_TAG}"
                        }

                        // Angular
                        bat "docker build -t %DOCKER_HUB_USER%/angular-frontend:${IMAGE_TAG} flight-booking-angular"
                        bat "docker push %DOCKER_HUB_USER%/angular-frontend:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl apply -f k8s/"
                bat "kubectl set image deployment/booking-service booking-service=%DOCKER_HUB_USER%/booking-service:${IMAGE_TAG} -n flight-app"
                bat "kubectl set image deployment/fare-service fare-service=%DOCKER_HUB_USER%/fare-service:${IMAGE_TAG} -n flight-app"
                bat "kubectl set image deployment/flight-service flight-service=%DOCKER_HUB_USER%/flight-and-search-service:${IMAGE_TAG} -n flight-app"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}
