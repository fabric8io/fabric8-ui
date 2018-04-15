export const step_2_1_output = {
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
      'name': 'gitRepositoryPattern',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitRepositoryDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Repository name pattern',
      'description': 'The regex pattern to match repository names',
      'valueChoices': [
        {
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
    }
  ]
};
