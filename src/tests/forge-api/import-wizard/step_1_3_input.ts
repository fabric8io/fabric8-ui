export const step_1_3_input = {
  'metadata': {
    'deprecated': false,
    'category': 'Uncategorized',
    'name': 'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
    'description': 'No Description'
  },
  'state': {
    'valid': true,
    'canExecute': false,
    'wizard': true,
    'canMoveToNextStep': true,
    'canMoveToPreviousStep': false,
    'steps': [
      'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep'
    ]
  },
  'inputs': [
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
    }
  ],
  'stepIndex': 1
};
