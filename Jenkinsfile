pipeline {
    agent {
        // container que executara job
        docker {
            image 'mcr.microsoft.com/playwright:v1.50.1-noble'
            // define rede (mesma do ambiente setado local)
            args '--network qatw-primeira-edicao_skynet'
        }
    }

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
