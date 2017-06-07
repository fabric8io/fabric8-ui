#!/usr/bin/groovy
@Library('github.com/fabric8io/fabric8-pipeline-library@master')
def utils = new io.fabric8.Utils()
def org = 'fabric8-ui'
def repo = 'fabric8-recommender'
fabric8UINode{
  ws {
    checkout scm
    readTrusted 'release.groovy'
    sh "git remote set-url origin git@github.com:${org}/${repo}.git"
    def pipeline = load 'release.groovy'

    if (utils.isCI()){
      container('ui'){
        pipeline.ci()
      }
    } else if (utils.isCD()){
      def branch
      container('ui'){
          branch = utils.getBranch()
      }
      
      def published
      container('ui'){
        published = pipeline.cd(branch)
      }

      def releaseVersion
      container('ui'){
          releaseVersion = utils.getLatestVersionFromTag()
      }

      if (published){
        pipeline.updateDownstreamProjects(releaseVersion)
      }
    }
  }
}

