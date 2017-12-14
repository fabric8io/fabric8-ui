export const step_3_1_output = {
  'state': {
    'valid': true,
    'canExecute': true,
    'wizard': true,
    'canMoveToNextStep': true,
    'canMoveToPreviousStep': true,
    'steps': [
      'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
      'Obsidian: Configure Pipeline',
      'io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep'
    ]
  },
  'messages': [],
  'inputs': [
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
  ]
};
