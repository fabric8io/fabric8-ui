export const step_3_2_output = {
  'metadata': {
    'deprecated': false,
    'category': 'Uncategorized',
    'name': 'io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep',
    'description': 'No Description'
  },
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
    ]
  },
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
    }
  ]
};
