export const importWizardStep1_GitOrganisation_Validate = {
  "payload": {
    "fields": [
      {
        "name": "gitOrganisation",
        "value": "corinnekrych",
        "valueType": "string",
        "display": {
          "choices": [
            {
              "index": 9,
              "id": "corinnekrych",
              "name": "corinnekrych",
              "description": "My personal github account",
              "visible": true,
              "isDefault": false,
              "selected": true
            }
          ],
          "hasChoices": true,
          "description": "The github organisation to import repositories from",
          "text": "corinnekrych",
          "inputType": "singleSelectionDropdown",
          "label": "Organisation",
          "required": true,
          "readonly": false,
          "enabled": true,
          "visible": true,
          "valid": true,
          "index": 0
        }
      }
    ],
    "results": [{}],
    "state": {
      "valid": true,
      "canMoveToNextStep": true,
      "canMovePreviousStep": false,
      "canExecute": true,
      "steps": [
          "io.fabric8.forge.generator.github.githubimportpickorganisationstep",
          "io.fabric8.forge.generator.github.githubimportpickrepositoriesstep",
          "io.fabric8.forge.generator.kubernetes.createbuildconfigstep",
      ],
      "currentStep": 0,
      "title": "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
      "description": "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep"
    }
  },
  "context": {
    "executeCommand": {
      // some content
    },
    "nextCommand": {
      // some content
    },
    "validationCommand": {
      "name": "fabric8-import-git",
      "parameters": {
        "pipeline": {
          "name": "fabric8-import-git",
          "step": {
            "name": "validate",
            "index": 0
          }
        },
        "fields": [
          {
            "name": "gitOrganisation",
            "value": "corinnekrych",
            "valueType": "string",
            "display": {
              "choices": [
                {
                  "index": 9,
                  "id": "corinnekrych",
                  "name": "corinnekrych",
                  "description": "My personal github account",
                  "visible": true,
                  "isDefault": false,
                  "selected": true
                }
              ],
              "hasChoices": true,
              "description": "The github organisation to import repositories from",
              "text": "corinnekrych",
              "inputType": "singleSelectionDropdown",
              "label": "Organisation",
              "required": true,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          }
        ],
        "validatedData": {
          "metadata": {
            "deprecated": false,
            "category": "Uncategorized",
            "name": "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
            "description": "No Description"
          },
          "state": {
            "valid": true,
            "canExecute": true,
            "wizard": true,
            "canMoveToNextStep": true,
            "canMoveToPreviousStep": false,
            "steps": [
              "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
              "io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep",
              "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep"
            ]
          },
          "inputs": [
            {
              "name": "gitOrganisation",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitOrganisationDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": true,
              "deprecated": false,
              "label": "Organisation",
              "description": "The github organisation to import repositories from",
              "valueChoices": [
                {
                  "id": "corinnekrych",
                  "description": "My personal github account",
                  "htmlUrl": "https://github.com/corinnekrych",
                  "name": "corinnekrych",
                  "valid": true
                }
              ],
              "class": "UISelectOne",
              "value": "corinnekrych"
            }
          ],
          "stepIndex": 0
        },
        "data": {
          "metadata": {
            "deprecated": false,
            "category": "Uncategorized",
            "name": "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
            "description": "No Description"
          },
          "state": {
            "valid": true,
            "canExecute": true,
            "wizard": true,
            "canMoveToNextStep": true,
            "canMoveToPreviousStep": false,
            "steps": [
              "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
              "io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep",
              "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep"
            ]
          },
          "inputs": [
            {
              "name": "gitOrganisation",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitOrganisationDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": true,
              "deprecated": false,
              "label": "Organisation",
              "description": "The github organisation to import repositories from",
              "valueChoices": [
                {
                  "id": "corinnekrych",
                  "description": "My personal github account",
                  "htmlUrl": "https://github.com/corinnekrych",
                  "name": "corinnekrych",
                  "valid": true
                }
              ],
              "class": "UISelectOne",
              "value": "corinnekrych"
            }
          ],
          "stepIndex": 0
        }
      }
    },
    "currentCommand": {
      "name": "fabric8-import-git",
      "parameters": {
        "pipeline": {
          "name": "fabric8-import-git",
          "step": {
            "name": "begin",
            "index": 0
          }
        },
        "fields": [],
        "validatedData": {
          "inputs": []
        },
        "data": {
          "inputs": []
        }
      }
    }
  }
};

export const validate_Response = {
  "payload": {
     "state": {
      "valid": true,
      "isExecute": false,
      "canMoveToNextStep": true,
      "canMovePreviousStep": false,
      "canExecute": true,
      "steps": [
        {
          "id": "io.fabric8.forge.generator.github.githubimportpickorganisationstep",
          "name": "1",
          "title": "Step 1",
          "active": false,
          "index": 0
        },
        {
          "id": "io.fabric8.forge.generator.github.githubimportpickrepositoriesstep",
          "name": "2",
          "title": "GitHub repository",
          "active": false,
          "index": 1
        },
        {
          "id": "io.fabric8.forge.generator.kubernetes.createbuildconfigstep",
          "name": "3",
          "title": "Build configuration",
          "active": false,
          "index": 2
        }
      ],
      "currentStep": 0,
      "title": "",
      "description": ""
    }
  },
  "context": {
    "nextCommand": null,
    "validationCommand": null,
    "executeCommand": {
      // some content
    },
    "currentCommand": {
      // some content
    }
  }
};


export const importWizardStep3_Jenkins_Validate = {
  "payload": {
    "fields": [
      {
        "name": "jenkinsSpace",
        "value": "ckrych-jenkins",
        "valueType": "string",
        "display": {
          "choices": [
            {
              "index": 0,
              "id": "ckrych",
              "name": "ckrych",
              "description": "ckrych",
              "visible": true,
              "isDefault": false,
              "selected": false
            },
            {
              "index": 1,
              "id": "ckrych-che",
              "name": "ckrych-che",
              "description": "ckrych-che",
              "visible": true,
              "isDefault": false,
              "selected": false
            },
            {
              "index": 2,
              "id": "ckrych-jenkins",
              "name": "ckrych-jenkins",
              "description": "ckrych-jenkins",
              "visible": true,
              "isDefault": false,
              "selected": true
            },
            {
              "index": 3,
              "id": "ckrych-run",
              "name": "ckrych-run",
              "description": "ckrych-run",
              "visible": true,
              "isDefault": false,
              "selected": false
            },
            {
              "index": 4,
              "id": "ckrych-stage",
              "name": "ckrych-stage",
              "description": "ckrych-stage",
              "visible": true,
              "isDefault": false,
              "selected": false
            }
          ],
          "hasChoices": true,
          "description": "The space running Jenkins",
          "text": "ckrych-jenkins",
          "inputType": "singleSelectionDropdown",
          "label": "Jenkins Space",
          "required": true,
          "readonly": false,
          "enabled": false,
          "visible": true,
          "valid": true,
          "index": 0
        }
      },
      {
        "name": "triggerBuild",
        "value": true,
        "valueType": "boolean",
        "display": {
          "choices": [],
          "hasChoices": false,
          "description": "Should a build be triggered immediately after import?",
          "text": true,
          "inputType": "singleInput",
          "label": "Trigger build",
          "required": false,
          "readonly": false,
          "enabled": true,
          "visible": true,
          "valid": true,
          "index": 0
        }
      },
      {
        "name": "addCIWebHooks",
        "value": true,
        "valueType": "boolean",
        "display": {
          "choices": [],
          "hasChoices": false,
          "description": "Should we add a Continuous Integration webhooks for Pull Requests?",
          "text": true,
          "inputType": "singleInput",
          "label": "Add continuous integration web hooks",
          "required": false,
          "readonly": false,
          "enabled": true,
          "visible": true,
          "valid": true,
          "index": 0
        }
      }
    ],
    "results": [],
    "state": {
      "valid": true,
      "isExecute": false,
      "canMoveToNextStep": false,
      "canMovePreviousStep": true,
      "canExecute": true,
      "steps": [
        {
          "id": "io.fabric8.forge.generator.github.githubimportpickorganisationstep",
          "name": "1",
          "title": "Step 1",
          "active": false,
          "index": 0
        },
        {
          "id": "io.fabric8.forge.generator.github.githubimportpickrepositoriesstep",
          "name": "2",
          "title": "GitHub repository",
          "active": false,
          "index": 1
        },
        {
          "id": "io.fabric8.forge.generator.kubernetes.createbuildconfigstep",
          "name": "3",
          "title": "Build configuration",
          "active": true,
          "index": 2
        }
      ],
      "currentStep": 2,
      "title": "Generating the application ...",
      "description": "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep"
    }
  },
  "context": {
    "executeCommand": {
      // some content
    },
    "nextCommand": {
      // some content
     },
    "validationCommand": {
      "name": "fabric8-import-git",
      "parameters": {
        "pipeline": {
          "name": "fabric8-import-git",
          "step": {
            "name": "validate",
            "index": 2
          }
        },
        "fields": [
          {
            "name": "gitOrganisation",
            "value": "corinnekrych",
            "valueType": "string",
            "display": {
              "choices": [
                {
                  "index": 9,
                  "id": "corinnekrych",
                  "name": "corinnekrych",
                  "description": "My personal github account",
                  "visible": true,
                  "isDefault": false,
                  "selected": true
                }
              ],
              "hasChoices": true,
              "description": "The github organisation to import repositories from",
              "text": "corinnekrych",
              "inputType": "singleSelectionDropdown",
              "label": "Organisation",
              "required": true,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          },
          {
            "name": "gitRepositoryPattern",
            "value": [],
            "valueType": "string",
            "display": {
              "choices": [
                {
                  "index": 1,
                  "id": "A",
                  "name": "A",
                  "description": "created at Mon Jan 12 11:11:16 CET 2015",
                  "visible": true,
                  "isDefault": false,
                  "selected": false
                }],
              "hasChoices": true,
              "description": "The regex pattern to match repository names",
              "text": [
                "A"
              ],
              "inputType": "multipleSelection",
              "label": "Repository name pattern",
              "required": false,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          },
          {
            "name": "jenkinsSpace",
            "value": "ckrych-jenkins",
            "valueType": "string",
            "display": {
              "choices": [
                {
                  "index": 0,
                  "id": "ckrych",
                  "name": "ckrych",
                  "description": "ckrych",
                  "visible": true,
                  "isDefault": false,
                  "selected": false
                },
                {
                  "index": 1,
                  "id": "ckrych-che",
                  "name": "ckrych-che",
                  "description": "ckrych-che",
                  "visible": true,
                  "isDefault": false,
                  "selected": false
                },
                {
                  "index": 2,
                  "id": "ckrych-jenkins",
                  "name": "ckrych-jenkins",
                  "description": "ckrych-jenkins",
                  "visible": true,
                  "isDefault": false,
                  "selected": true
                },
                {
                  "index": 3,
                  "id": "ckrych-run",
                  "name": "ckrych-run",
                  "description": "ckrych-run",
                  "visible": true,
                  "isDefault": false,
                  "selected": false
                },
                {
                  "index": 4,
                  "id": "ckrych-stage",
                  "name": "ckrych-stage",
                  "description": "ckrych-stage",
                  "visible": true,
                  "isDefault": false,
                  "selected": false
                }
              ],
              "hasChoices": true,
              "description": "The space running Jenkins",
              "text": "ckrych-jenkins",
              "inputType": "singleSelectionDropdown",
              "label": "Jenkins Space",
              "required": true,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          },
          {
            "name": "triggerBuild",
            "value": true,
            "valueType": "boolean",
            "display": {
              "choices": [],
              "hasChoices": false,
              "description": "Should a build be triggered immediately after import?",
              "text": true,
              "inputType": "singleInput",
              "label": "Trigger build",
              "required": false,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          },
          {
            "name": "addCIWebHooks",
            "value": true,
            "valueType": "boolean",
            "display": {
              "choices": [],
              "hasChoices": false,
              "description": "Should we add a Continuous Integration webhooks for Pull Requests?",
              "text": true,
              "inputType": "singleInput",
              "label": "Add CI?",
              "required": false,
              "readonly": false,
              "enabled": true,
              "visible": true,
              "valid": true,
              "index": 0
            }
          }
        ],
        "validatedData": {
          "metadata": {
            "deprecated": false,
            "category": "Uncategorized",
            "name": "io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep",
            "description": "No Description"
          },
          "state": {
            "valid": true,
            "canExecute": true,
            "wizard": true,
            "canMoveToNextStep": true,
            "canMoveToPreviousStep": true,
            "steps": [
              "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
              "io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep",
              "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep"
            ],
            "isExecute": false
          },
          "inputs": [
            {
              "name": "gitOrganisation",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitOrganisationDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": true,
              "deprecated": false,
              "label": "Organisation",
              "description": "The github organisation to import repositories from",
              "valueChoices": [
                {
                  "id": "corinnekrych",
                  "description": "My personal github account",
                  "htmlUrl": "https://github.com/corinnekrych",
                  "name": "corinnekrych",
                  "valid": true
                }
              ],
              "class": "UISelectOne",
              "value": "corinnekrych"
            },
            {
              "name": "gitRepositoryPattern",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitRepositoryDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": false,
              "deprecated": false,
              "label": "Repository name pattern",
              "description": "The regex pattern to match repository names",
              "valueChoices": [
                {
                  "id": "A",
                  "description": "created at Mon Jan 12 11:11:16 CET 2015",
                  "name": "A",
                  "valid": true
                }
              ],
              "class": "UISelectMany",
              "value": [
                "wit-docker-example"
              ]
            }
          ],
          "results": [],
          "stepIndex": 1
        },
        "data": {
          "metadata": {
            "deprecated": false,
            "category": "Uncategorized",
            "name": "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep",
            "description": "No Description"
          },
          "state": {
            "valid": true,
            "canExecute": true,
            "wizard": true,
            "canMoveToNextStep": false,
            "canMoveToPreviousStep": true,
            "steps": [
              "io.fabric8.forge.generator.github.GithubImportPickOrganisationStep",
              "io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep",
              "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep"
            ],
            "isExecute": false
          },
          "inputs": [
            {
              "name": "gitOrganisation",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitOrganisationDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": true,
              "deprecated": false,
              "label": "Organisation",
              "description": "The github organisation to import repositories from",
              "valueChoices": [
                {
                  "id": "corinnekrych",
                  "description": "My personal github account",
                  "htmlUrl": "https://github.com/corinnekrych",
                  "name": "corinnekrych",
                  "valid": true
                }
              ],
              "class": "UISelectOne",
              "value": "corinnekrych"
            },
            {
              "name": "gitRepositoryPattern",
              "shortName": " ",
              "valueType": "io.fabric8.forge.generator.git.GitRepositoryDTO",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": false,
              "deprecated": false,
              "label": "Repository name pattern",
              "description": "The regex pattern to match repository names",
              "valueChoices": [
                {
                  "id": "A",
                  "description": "created at Mon Jan 12 11:11:16 CET 2015",
                  "name": "A",
                  "valid": true
                }],
              "class": "UISelectMany",
              "value": [
                "A"
              ]
            },
            {
              "name": "jenkinsSpace",
              "shortName": " ",
              "valueType": "java.lang.String",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": true,
              "deprecated": false,
              "label": "Jenkins Space",
              "description": "The space running Jenkins",
              "valueChoices": [
                {
                  "id": "ckrych"
                },
                {
                  "id": "ckrych-che"
                },
                {
                  "id": "ckrych-jenkins"
                },
                {
                  "id": "ckrych-run"
                },
                {
                  "id": "ckrych-stage"
                }
              ],
              "class": "UISelectOne",
              "value": "ckrych-jenkins"
            },
            {
              "name": "triggerBuild",
              "shortName": " ",
              "valueType": "java.lang.Boolean",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": false,
              "deprecated": false,
              "label": "Trigger build",
              "description": "Should a build be triggered immediately after import?",
              "class": "UIInput",
              "value": true
            },
            {
              "name": "addCIWebHooks",
              "shortName": " ",
              "valueType": "java.lang.Boolean",
              "inputType": "org.jboss.forge.inputType.DEFAULT",
              "enabled": true,
              "required": false,
              "deprecated": false,
              "label": "Add CI?",
              "description": "Should we add a Continuous Integration webhooks for Pull Requests?",
              "class": "UIInput",
              "value": true
            }
          ],
          "results": []
        }
      }
    },
    "currentCommand": {}
  }
};
