#!/usr/bin/groovy
def ci (){
    stage('build'){
        sh 'npm install'
    }
    stage('functional test'){
        sh 'npm run test:unit'
    }
}

def cd (b){
    stage('fix git repo'){
        sh './fix-git-repo.sh'
    }

    stage('build'){
        sh 'npm install'
        sh 'npm run build'
    }

    // stage('functional test'){
    //     sh './run_functional_tests.sh'
    // }

    stage('release'){
        def published = npmRelease{
            branch = b
        }
        return published
    }
}

def updateDownstreamProjects(v){
    echo 'we would Update Downstream Projects'
    pushPackageJSONChangePR{
        propertyName = 'fabric8-stack-analysis-ui'
        projects = [
                'fabric8-ui/fabric8-npm-dependencies'
        ]
        version = v
        containerName = 'ui'
        autoMerge = true
    }
}
return this