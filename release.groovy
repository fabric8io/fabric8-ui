#!/usr/bin/groovy
def ci (){
    stage('build npm'){
        sh 'npm install'
        sh '''
        export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
        export FABRIC8_RECOMMENDER_API_URL="https://api-bayesian.dev.rdu2c.fabric8.io/api/v1/"
        export FABRIC8_FORGE_API_URL="https://forge.api.prod-preview.openshift.io"
        export FABRIC8_SSO_API_URL="https://sso.prod-preview.openshift.io/"
        export FABRIC8_AUTH_API_URL="https://auth.prod-preview.openshift.io/api/"
        export FABRIC8_REALM="fabric8"

        npm run build:prod
        '''
    }

    stage('unit test'){
        sh './run_unit_tests.sh'
    }
    stage('functional test'){
      sh '''
        /usr/bin/Xvfb :99 -screen 0 1024x768x24 &
        export API_URL=https://api.prod-preview.openshift.io/api/
        export NODE_ENV=inmemory

        npm install
        ./run_functional_tests.sh
        '''
    }

    stage('End-to-End test'){
      sh '''
        npm install
        ./run_EE_tests.sh https://openshift.io
        '''
    }

}

def buildImage(imageName){
    stage('build snapshot image'){
        sh "docker build -t ${imageName} -f Dockerfile.deploy ."
    }

    stage('push snapshot image'){
        sh "docker push ${imageName}"
    }
}

def updateDownstreamProjects(v){
  pushPomPropertyChangePR {
    propertyName = 'fabric8-ui.version'
    projects = [
            'fabric8io/fabric8-platform'
    ]
    containerName = 'ui'
    version = v
  }
}

return this
