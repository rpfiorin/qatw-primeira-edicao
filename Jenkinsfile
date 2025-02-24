pipeline {
    agent any

    stages {
        stage('Node.js deps') {
            steps {
                sh 'npm i'
            }
        }
        stage('E2E tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
