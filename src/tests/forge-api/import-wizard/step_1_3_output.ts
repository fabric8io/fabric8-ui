export const step_1_3_output = {
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
  ]
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
    'valueChoices': [
      {
        'id': '3musket33rs.github.com',
        'description': 'Web Site',
        'name': '3musket33rs.github.com',
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
    'class': 'UISelectMany',
    'value': []
  }
]
};
