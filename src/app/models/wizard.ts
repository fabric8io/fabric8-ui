//TODO: refactor and refine domain model for wizard and configurator
import { Space } from './space'

export class Wizard {
  constructor() { }
  step(step: number = 0) {
    this.activeStep = step;
  }
  activeStep: number = 0;
};
// The navigator is used to inject wizard navigation into components and allow them to participate
// in wizard navigation
export class WizardNavigator {
  navigate(wizard: Wizard, steps: Array<WizardStepConfig> = [], wizardStepName: string = '') {
    try {
      let wizardStepConfig = steps.find((wizardStepConfig) => {
        return wizardStepConfig.name.toLowerCase() === (wizardStepName || '').toLowerCase()
      });
      if (wizardStepConfig) {
        wizard.step(wizardStepConfig.step);
      }
      else {
        console.error(`WizardNavigationError: The ${wizardStepName} wizard step was not found or configured.`)
      }
    }
    catch (err) {
      console.error(`WizardNavigationException:${err.message}.`)
    }
  }
};

export class WizardStepConfig {
  constructor() { }
  step: number = 0;
  name: string = '';
};

export class ProjectType {
  constructor() { }
  description: string;
}

export class ProjectInfo {
  constructor() { }
  name: string;
  pipelineName: string;
  topLevelPackage: string;
  version: string;
  type: ProjectType;
  stack: StackInfo
  pipeline: PipelineInfo
}

export class StackInfo {
  name: string;
  icon?: string = "";
}

export class PipelineInfo {
  name: string;
  icon?: string = "";
  stages: Array<PipelineStageInfo> = [];
  environments: Array<PipelineEnvironmentInfo> = [];
}

export class PipelineEnvironmentInfo {
  name: string = "";
}
export class PipelineStageInfo {
  name?: string = "";
  tasks: Array<PipelineTaskInfo> = [];
}

export class PipelineTaskInfo {
  name: string = "";
}

export interface IWizardStep {
  index: number;
}

export interface IWizardSteps {
  space: IWizardStep;
  forge: IWizardStep;
  quickStart: IWizardStep;
  stack: IWizardStep;
  pipeline: IWizardStep;
}

export class SpaceConfigurator {
  // represents the selected or created collaboration space
  space: Space;
  // represents the project being configured
  project: ProjectInfo = new ProjectInfo;

  constructor() {
    this.space = {} as Space;
    this.project = new ProjectInfo();
  }
  // initialiser with callback for external dependency initialisation
  initSpace(init: Function = (space: Space) => { }): void {
    this.space = {} as Space;
    this.project = new ProjectInfo();
    this.project.name = "Project1";

    this.space.name = 'BalloonPopGame';
    this.space.path = `/pmuir/${this.space.name}`;
    this.space.description = this.space.name;
    this.space.privateSpace = false;
    init(this.space);
  }
  //TODO:dynamic observable list
  availableProjectTypes: Array<ProjectType> = [
    { description: "Creates a new Obsidian :: QuickStart :: Spring Boot Tomcate - Rest" }
  ];
  //TODO:dynamic observable list
  availableStacks: Array<StackInfo> = [
    { name: "Django", icon: "icon-stack-python" },
    { name: "From Archetype", icon: "icon-stack-maven" },
    { name: "From Archetype Catalog", icon: "icon-stack-maven" },
    { name: "Funktion", icon: "icon-stack-funktion" },
    { name: "Generic", icon: "icon-stack-java" },
    { name: "Go", icon: "icon-stack-go" },
    { name: "Integration", icon: "icon-stack-camel" },
    { name: "Java Enterprise Archive (EAR)", icon: "icon-stack-java" },
    { name: "Java Library (JAR)", icon: "icon-stack-java" },
    { name: "Java Web Application (WAR)", icon: "icon-stack-java" },
    { name: "Microservice", icon: "icon-stack-microservice" },
    { name: "NodeJS", icon: "icon-stack-nodejs" },
    { name: "Rails", icon: "icon-stack-rails" },
    { name: "Spring Boot", icon: "icon-stack-spring" },
    { name: "Swift", icon: "icon-stack-swift" },
    { name: "Vert.x", icon: "icon-stack-vertx" },
    { name: "Wildfly Swarm", icon: "icon-stack-wildfly" },
  ];
  //TODO:dynamic observable list
  availablePipelines: Array<PipelineInfo> = [
    {
      name: "Build Image",
      stages: [
        {
          tasks: [
            {
              name: "canary image"
            }
          ]
        }
      ],
      environments: [
      ]
    },
    {
      name: "Canary Release And Stage",
      stages: [
        {
          tasks: [
            {
              name: "canary image"
            },
            {
              name: "integration test"
            }
          ]
        },
        {
          tasks: [
            { name: "rolling upgrade Staging" }
          ]
        }
      ],
      environments: [
        { name: "testing" },
        { name: "staging" }
      ]

    },
    {
      name: "Canary Release Stage and Approve",
      stages: [
        {
          tasks: [
            { name: "canary image" },
            { name: "integration test" }
          ]
        },
        {
          tasks: [
            { name: "rolling upgrade Staging" },
            { name: "approve" }
          ]
        },
        {
          tasks: [
            { name: "rolling upgrade Production" }
          ]
        }
      ],
      environments: [
        { name: "testing" },
        { name: "staging" },
        { name: "production" }
      ]
    },
    {
      name: "Deploy",
      stages: [
        {
          tasks: [
            {
              name: "deploy"
            }
          ]
        }
      ],
      environments: []

    },
    {
      name: "Install",
      stages: [
        {
          tasks: [
            {
              name: "install"
            }
          ]
        }
      ],
      environments: []
    }
  ];
}

