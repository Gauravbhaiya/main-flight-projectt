pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'gaurav1231'
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
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build - Profile Service') {
            steps {
                dir('FlightBooking-mainn/profilemanagement-service') {
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build - Flight Service') {
            steps {
                dir('FlightBooking-mainn/flight-and-search-service') {
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build - Booking Service') {
            steps {
                dir('FlightBooking-mainn/booking-service') {
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build - Fare Service') {
            steps {
                dir('FlightBooking-mainn/fare-service') {
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build - API Gateway') {
            steps {
                dir('FlightBooking-mainn/api-gateway') {
                    sh 'chmod +x mvnw && ./mvnw clean package -DskipTests'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"

                        def services = [
                            'service-registry',
                            'profilemanagement-service',
                            'flight-and-search-service',
                            'booking-service',
                            'fare-service',
                            'api-gateway'
                        ]

                        services.each { service ->
                            sh "docker build -t $DOCKER_HUB_USER/${service}:${IMAGE_TAG} FlightBooking-mainn/${service}"
                            sh "docker push $DOCKER_HUB_USER/${service}:${IMAGE_TAG}"
                        }

                        // Angular
                        sh "docker build -t $DOCKER_HUB_USER/angular-frontend:${IMAGE_TAG} flight-booking-angular"
                        sh "docker push $DOCKER_HUB_USER/angular-frontend:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f k8s/"
                sh "kubectl set image deployment/booking-service booking-service=$DOCKER_HUB_USER/booking-service:${IMAGE_TAG} -n flight-app"
                sh "kubectl set image deployment/fare-service fare-service=$DOCKER_HUB_USER/fare-service:${IMAGE_TAG} -n flight-app"
                sh "kubectl set image deployment/flight-service flight-service=$DOCKER_HUB_USER/flight-and-search-service:${IMAGE_TAG} -n flight-app"
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
