import { Gui, MetaData, Option, State } from './gui.model';
import { History} from './history.component';

export const commandInfoExpectedResponse = {
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
    'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep']
  },
  'inputs': [{
    'name': 'gitOrganisation',
    'shortName': ' ',
    'valueType': 'io.fabric8.forge.generator.git.GitOrganisationDTO',
    'inputType': 'org.jboss.forge.inputType.DEFAULT',
    'enabled': true,
    'required': true,
    'deprecated': false,
    'label': 'Organisation',
    'description': 'The github organisation to import repositories from',
    'valueChoices': [{
      'id': '3musket33rs',
      'avatarUrl': 'https://avatars2.githubusercontent.com/u/1974314?v=4',
      'description': 'http://3musket33rs.github.com',
      'htmlUrl': 'https://github.com/3musket33rs',
      'name': '3.musket33rs',
      'valid': true
    }, {
      'id': 'corinnekrych',
      'description': 'My personal github account',
      'htmlUrl': 'https://github.com/corinnekrych',
      'name': 'corinnekrych',
      'valid': true
    }],
    'class': 'UISelectOne',
    'value': 'corinnekrych'
  }]
};
const metadata = {
  'deprecated': false,
  'category': 'Uncategorized',
  'name': 'io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
  'description': 'No Description'
} as MetaData;
const state = {
  'valid': true,
  'canExecute': false,
  'wizard': true,
  'canMoveToNextStep': true,
  'canMoveToPreviousStep': false,
  'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
    'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep']
} as State;
const options = [{
  'id': '3musket33rs',
  'description': 'http://3musket33rs.github.com',
  'name': '3.musket33rs'
}, {
  'id': 'corinnekrych',
  'description': 'My personal github account',
  'name': 'corinnekrych'
}] as Option[];

export const gui = {
  'metadata': metadata,
  'state': state,
  'inputs': [{
    'name': 'gitOrganisation',
    'shortName': ' ',
    'valueType': 'io.fabric8.forge.generator.git.GitOrganisationDTO',
    'inputType': 'org.jboss.forge.inputType.DEFAULT',
    'enabled': true,
    'required': true,
    'deprecated': false,
    'label': 'Organisation',
    'valueChoices': options,
    'class': 'UISelectOne',
    'value': 'corinnekrych'
  }],
  stepIndex: 1
} as Gui;

export const nextStepInput = {
  'state': [gui],
  'ready': true
  } as History;

export const nextStepExpectedResponse = {
  'metadata': {
    'deprecated': false,
    'category': 'Uncategorized',
    'name': 'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
    'description': 'No Description'
  }, 'state': {
    'valid': false,
    'canExecute': false,
    'wizard': true,
    'canMoveToNextStep': false,
    'canMoveToPreviousStep': true,
    'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
      'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep']
  }, 'inputs': [{
    'name': 'gitRepositoryPattern',
    'shortName': ' ',
    'valueType': 'io.fabric8.forge.generator.git.GitRepositoryDTO',
    'inputType': 'org.jboss.forge.inputType.DEFAULT',
    'enabled': true,
    'required': true,
    'deprecated': false,
    'label': 'Repository name pattern',
    'description': 'The regex pattern to match repository names',
    'valueChoices': [{
      'id': 'A',
      'description': 'created at Mon Jan 12 10:11:16 UTC 2015',
      'name': 'A',
      'valid': true
    }],
    'class': 'UISelectMany',
    'value': []
  }]
};
export const executeInput = {
  'state': [{
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
      'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
        'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep']
    },
    'inputs': [{
      'name': 'gitOrganisation',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitOrganisationDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Organisation',
      'description': 'The github organisation to import repositories from',
      'valueChoices': [{
        'id': '3musket33rs',
        'avatarUrl': 'https://avatars2.githubusercontent.com/u/1974314?v=4',
        'description': 'http://3musket33rs.github.com',
        'htmlUrl': 'https://github.com/3musket33rs',
        'name': '3.musket33rs',
        'valid': true
      }, {
        'id': 'corinnekrych',
        'description': 'My personal github account',
        'htmlUrl': 'https://github.com/corinnekrych',
        'name': 'corinnekrych',
        'valid': true
      }],
      'class': 'UISelectOne',
      'value': 'corinnekrych'
    }],
    'stepIndex': 1
  }, {
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
      'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
        'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep']
    },
    'inputs': [{
      'name': 'gitRepositoryPattern',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.git.GitRepositoryDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Repository name pattern',
      'description': 'The regex pattern to match repository names',
      'valueChoices': [{
        'id': 'A',
        'description': 'created at Mon Jan 12 10:11:16 UTC 2015',
        'name': 'A',
        'valid': true,
        'visible': true
      }],
      'class': 'UISelectMany',
      'value': ['A']
    }],
    'stepIndex': 2
  }, {
    'metadata': {
      'deprecated': false,
      'category': 'Obsidian',
      'name': 'Obsidian: Configure Pipeline',
      'description': 'Configure the Pipeline for the new project'
    },
    'state': {
      'valid': true,
      'canExecute': true,
      'wizard': true,
      'canMoveToNextStep': true,
      'canMoveToPreviousStep': true,
      'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
        'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
        'Obsidian: Configure Pipeline',
        'io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep']
    },
    'inputs': [{
      'name': 'pipeline',
      'shortName': ' ',
      'valueType': 'io.fabric8.forge.generator.pipeline.PipelineDTO',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Pipeline',
      'description': 'The Jenkinsfile used to define the Continous Delivery pipeline',
      'valueChoices': [{
        'id': 'Release',
        'builder': 'maven',
        'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project ' +
        'into the maven repository\n* runs an integration test in the **Test** environment\n',
        'environments': ['Test'],
        'label': 'Release',
        'stages': [{
          'name': 'Build Release',
          'index': 0,
          'icon': 'fa-check-circle',
          'color': 'success'
        }, {'name': 'Integration Test', 'index': 1, 'icon': 'fa-check-circle', 'color': 'success'}],
        'value': 'maven/Release/Jenkinsfile',
        'display': {
          'isDefault': true,
          'hasIcon': false,
          'icon': 'fa fa-check',
          'view': 'image',
          'collapsed': true,
          'collapsible': true,
          'hasView': true,
          'verticalLayout': true
        },
        'name': 'Release',
        'description': '<p>Maven based pipeline which:</p>\n<ul>\n<li>creates a new version then builds and deploys the ' +
        'project into the maven repository</li>\n<li>runs an integration test in the <strong>Test</strong> ' +
        'environment</li>\n</ul>\n'
      }, {
        'id': 'Release and Stage',
        'builder': 'maven',
        'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project ' +
        'into the maven repository\n* runs an integration test in the **Test** environment\n* stages the new version into ' +
        'the **Stage** environment\n',
        'environments': ['Test', 'Stage'],
        'label': 'Release and Stage',
        'stages': [{
          'name': 'Build Release',
          'index': 0,
          'icon': 'fa-check-circle',
          'color': 'success'
        }, {
          'name': 'Integration Test',
          'index': 1,
          'icon': 'fa-check-circle',
          'color': 'success'
        }, {'name': 'Rollout to Stage', 'index': 2, 'icon': 'fa-check-circle', 'color': 'success'}],
        'value': 'maven/ReleaseAndStage/Jenkinsfile',
        'display': {
          'isDefault': true,
          'hasIcon': false,
          'icon': 'fa fa-check',
          'view': 'image',
          'collapsed': true,
          'collapsible': true,
          'hasView': true,
          'verticalLayout': true
        },
        'name': 'Release and Stage',
        'description': '<p>Maven based pipeline which:</p>\n<ul>\n<li>creates a new version then builds and deploys the ' +
        'project into the maven repository</li>\n<li>runs an integration test in the <strong>Test</strong> environment</li>\n' +
        '<li>stages the new version into the <strong>Stage</strong> environment</li>\n</ul>\n'
      }, {
        'id': 'Release, Stage, Approve and Promote',
        'builder': 'maven',
        'descriptionMarkdown': 'Maven based pipeline which:\n\n* creates a new version then builds and deploys the project ' +
        'into the maven repository\n* runs an integration test in the **Test** environment\n* stages the new version into ' +
        'the **Stage** environment\n* waits for **Approval** to promote \n* promotes to the **Run** environment\n',
        'environments': ['Test', 'Stage', 'Run'],
        'label': 'Release, Stage, Approve and Promote',
        'stages': [{
          'name': 'Build Release',
          'index': 0,
          'icon': 'fa-check-circle',
          'color': 'success'
        }, {
          'name': 'Integration Test',
          'index': 1,
          'icon': 'fa-check-circle',
          'color': 'success'
        }, {'name': 'Rollout to Stage', 'index': 2, 'icon': 'fa-check-circle', 'color': 'success'}, {
          'name': 'Approve',
          'index': 3,
          'icon': 'fa-pause-circle',
          'color': 'warning'
        }, {'name': 'Rollout to Run', 'index': 4, 'icon': 'fa-check-circle', 'color': 'success'}],
        'value': 'maven/ReleaseStageApproveAndPromote/Jenkinsfile',
        'display': {
          'isDefault': true,
          'hasIcon': false,
          'icon': 'fa fa-check',
          'view': 'image',
          'collapsed': false,
          'collapsible': true,
          'hasView': true,
          'verticalLayout': true
        },
        'name': 'Release, Stage, Approve and Promote',
        'description': '<p>Maven based pipeline which:</p>\n<ul>\n<li>creates a new version then builds and deploys the ' +
        'project into the maven repository</li>\n<li>runs an integration test in the <strong>Test</strong> environment</li>' +
        '\n<li>stages the new version into the <strong>Stage</strong> environment</li>\n<li>waits for ' +
        '<strong>Approval</strong> to promote </li>\n<li>promotes to the <strong>Run</strong> environment</li>\n</ul>\n'
      }],
      'class': 'UISelectOne',
      'value': 'Release, Stage, Approve and Promote'
    }, {
      'name': 'kubernetesSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Organisation',
      'description': 'The organisation',
      'valueChoices': [{'id': 'ckrych'}, {'id': 'ckrych-che'}, {'id': 'ckrych-jenkins'},
        {'id': 'ckrych-run'}, {'id': 'ckrych-stage'}],
      'class': 'UISelectOne',
      'value': 'ckrych'
    }, {
      'name': 'labelSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Space',
      'description': 'The space for the new app',
      'class': 'UIInput'
    }, {
      'name': 'overrideJenkinsFile',
      'shortName': ' ',
      'valueType': 'java.lang.Boolean',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': false,
      'deprecated': false,
      'label': 'Override Jenkins and POM files',
      'description': 'The repository (Incognito) has already a Jenkins file.',
      'class': 'UIInput',
      'value': true
    }],
    'stepIndex': 3
  }, {
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
      'steps': ['io.fabric8.forge.generator.github.GithubImportPickOrganisationStep',
        'io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep',
        'Obsidian: Configure Pipeline', 'io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep']
    },
    'inputs': [{
      'name': 'jenkinsSpace',
      'shortName': ' ',
      'valueType': 'java.lang.String',
      'inputType': 'org.jboss.forge.inputType.DEFAULT',
      'enabled': true,
      'required': true,
      'deprecated': false,
      'label': 'Jenkins Space',
      'description': 'The space running Jenkins',
      'valueChoices': [{'id': 'ckrych'}, {'id': 'ckrych-che'},
        {'id': 'ckrych-jenkins'},
        {'id': 'ckrych-run'},
        {'id': 'ckrych-stage'}],
      'class': 'UISelectOne',
      'value': 'ckrych-jenkins'
    }, {
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
    }, {
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
    }],
    'stepIndex': 4
  }], 'ready': true
} as any;

export const executeOutput = [null, null, null, null, {'warnings': []}, null, {
  'namespace': 'ckrych',
  'buildConfigName': 'aerogear-simplepush-server',
  'gitUrl': 'https://github.com/corinnekrych/aerogear-simplepush-server.git',
  'cheStackId': 'java-centos',
  'organisationJenkinsJobUrl': null,
  'gitRepositoryNames': ['aerogear-simplepush-server'],
  'gitRepositories': [{
    'url': 'https://github.com/corinnekrych/aerogear-simplepush-server.git',
    'repoName': 'aerogear-simplepush-server'
  }],
  'gitOwnerName': 'corinnekrych',
  'warnings': []
}] as any;

export const inputForPost = {
  'state': {},
  'stepIndex': 1,
  'inputs': [
    {
      'name': 'gitOrganisation',
      'value': 'corinnekrych'
    }
  ]
};
