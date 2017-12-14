export const step_4_2_input = {
  'state': {
    'valid': true,
    'canExecute': true,
    'wizard': true,
    'canMoveToNextStep': false,
    'canMoveToPreviousStep': true,
    'steps': [
      'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
      'Obsidian: Configure Pipeline',
      'io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep'
    ],
    'isExecute': false
  },
  'messages': [],
  'inputs': [
    {
      'name': 'jenkinsSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Jenkins Space',
      'description': 'The space running Jenkins',
      'valueChoices': [
        {
          'id': 'ckrych'
        },
        {
          'id': 'ckrych-che'
        },
        {
          'id': 'ckrych-jenkins'
        },
        {
          'id': 'ckrych-run'
        },
        {
          'id': 'ckrych-stage'
        }
      ],
      'class': 'UISelectOne',
      'value': 'ckrych-jenkins'
    },
    {
      'name': 'triggerBuild',
      'shortName': ' ',
      'valueType': 'java.lang.Boolean',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Trigger build',
      'description': 'Should a build be triggered immediately after import?',
      'class': 'UIInput',
      'value': true
    },
    {
      'name': 'addCIWebHooks',
      'shortName': ' ',
      'valueType': 'java.lang.Boolean',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Add CI?',
      'description': 'Should we add a Continuous Integration webhooks for Pull Requests?',
      'class': 'UIInput',
      'value': true
    },
    {
      'name': 'gitOrganisation',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitOrganisationDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Organisation',
      'description': 'The github organisation to import repositories from',
      'valueChoices': [
        {
          'id': '3musket33rs',
          'avatarUrl': 'https://avatars2.githubusercontent.com/u/1974314?v=4',
          'description': 'http://3musket33rs.github.com',
          'htmlUrl': 'https://github.com/3musket33rs',
          'name': '3.musket33rs',
          'valid': true
        },
        {
          'id': 'corinnekrych',
          'description': 'My personal github account',
          'htmlUrl': 'https://github.com/corinnekrych',
          'name': 'corinnekrych',
          'valid': true
        }
      ],
      'class': 'UISelectOne',
      'value': 'corinnekrych'
    },
    {
      'name': 'gitRepositoryPattern',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitRepositoryDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Repository name pattern',
      'description': 'The regex pattern to match repository names',
      'valueChoices': [        {
        'id': 'sprint135',
        'description': 'created at Tue Aug 08 07:52:49 UTC 2017',
        'name': 'sprint135',
        'valid': true
      },
        {
          'id': 'sprint135bis',
          'description': 'created at Tue Aug 08 08:16:47 UTC 2017',
          'name': 'sprint135bis',
          'valid': true
        }
      ],
      'class': 'UISelectMany',
      'value': [
        'sprint135',
        'sprint135bis'
      ]
    },
    {
      'name': 'pipeline',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.pipeline.PipelineDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Pipeline',
      'description': 'The Jenkinsfile used to define the Continous Delivery pipeline',
      'valueChoices': [
        {
          'id': 'Release',
          'builder': 'maven',
          'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project into the maven repository\n* runs an integration test in the **Test** environment\n',
          'environments': [
            'Test'
          ],
          'label': 'Release',
          'stages': [
            'Build Release',
            'Integration Test'
          ],
          'value': 'maven/Release/Jenkinsfile'
        },
        {
          'id': 'Release and Stage',
          'builder': 'maven',
          'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project into the maven repository\n* runs an integration test in the **Test** environment\n* stages the new version into the **Stage** environment\n',
          'environments': [
            'Test',
            'Stage'
          ],
          'label': 'Release and Stage',
          'stages': [
            'Build Release',
            'Integration Test',
            'Rollout to Stage'
          ],
          'value': 'maven/ReleaseAndStage/Jenkinsfile'
        },
        {
          'id': 'Release, Stage, Approve and Promote',
          'builder': 'maven',
          'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project into the maven repository\n* runs an integration test in the **Test** environment\n* stages the new version into the **Stage** environment\n* waits for **Approval** to promote \n* promotes to the **Run** environment\n',
          'environments': [
            'Test',
            'Stage',
            'Run'
          ],
          'label': 'Release, Stage, Approve and Promote',
          'stages': [
            'Build Release',
            'Integration Test',
            'Rollout to Stage',
            'Approve',
            'Rollout to Run'
          ],
          'value': 'maven/ReleaseStageApproveAndPromote/Jenkinsfile'
        }
      ],
      'class': 'UISelectOne',
      'value': 'Release, Stage, Approve and Promote'
    },
    {
      'name': 'kubernetesSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Organisation',
      'description': 'The organisation',
      'valueChoices': [
        {
          'id': 'ckrych'
        },
        {
          'id': 'ckrych-che'
        },
        {
          'id': 'ckrych-jenkins'
        },
        {
          'id': 'ckrych-run'
        },
        {
          'id': 'ckrych-stage'
        }
      ],
      'class': 'UISelectOne',
      'value': 'ckrych'
    },
    {
      'name': 'labelSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Space',
      'description': 'The space for the new app',
      'class': 'UIInput',
      'value': 'testwizard'
    }
  ],
  'results': [],
  'stepIndex': 4,
  'isExecute': true
};
