export const step_2_2_input = {
  'metadata': {
    'deprecated': false,
    'category': 'Uncategorized',
    'name': 'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
    'description': 'No Description'
  },
  'state': {
    'valid': false,
    'canExecute': false,
    'wizard': true,
    'canMoveToNextStep': false,
    'canMoveToPreviousStep': true,
    'steps': [
      'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep'
    ],
    'isExecute': false
  },
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
        },
        {
          'id': 'fabric8io',
          'avatarUrl': 'https://avatars1.githubusercontent.com/u/6074349?v=4',
          'description': 'https://fabric8.io/',
          'htmlUrl': 'https://github.com/fabric8io',
          'name': 'fabric8',
          'valid': true
        }
      ],
      'class': 'UISelectOne',
      'value': 'corinnekrych'
    }
  ],
  'results': [],
  'stepIndex': 2
};
