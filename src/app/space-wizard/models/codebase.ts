import { Space, SpaceAttributes } from 'ngx-fabric8-wit';

export class CodebaseType {
  description: string;

  constructor() {
  }

}

export class CodebaseInfo {
  name: string;
  pipelineName: string;
  topLevelPackage: string;
  version: string;
  type: CodebaseType;
  stack: StackInfo;
  pipeline: PipelineInfo;

  constructor() {
  }

}

export class StackInfo {
  name: string;
  icon?: string = '';
}

export class PipelineInfo {
  name: string;
  icon?: string = '';
  stages: Array<PipelineStageInfo> = [];
  environments: Array<PipelineEnvironmentInfo> = [];
}

export class PipelineEnvironmentInfo {
  name: string = '';
}
export class PipelineStageInfo {
  name?: string = '';
  tasks: Array<PipelineTaskInfo> = [];
}

export class PipelineTaskInfo {
  name: string = '';
}

export class SpaceConfigurator {


  // represents the selected or created collaboration space
  space: Space;
  // represents the project being configured
  project: CodebaseInfo = new CodebaseInfo;

  // TODO:dynamic observable list
  availableProjectTypes: Array<CodebaseType> = [
    { description: 'Creates a new Obsidian :: QuickStart :: Spring Boot Tomcat - Rest' }
  ];
  // TODO:dynamic observable list
  availableStacks: Array<StackInfo> = [
    { name: 'Django', icon: 'icon-stack-python' },
    { name: 'From Archetype', icon: 'icon-stack-maven' },
    { name: 'From Archetype Catalog', icon: 'icon-stack-maven' },
    { name: 'Funktion', icon: 'icon-stack-funktion' },
    { name: 'Generic', icon: 'icon-stack-java' },
    { name: 'Go', icon: 'icon-stack-go' },
    { name: 'Integration', icon: 'icon-stack-camel' },
    { name: 'Java Enterprise Archive (EAR)', icon: 'icon-stack-java' },
    { name: 'Java Library (JAR)', icon: 'icon-stack-java' },
    { name: 'Java Web Application (WAR)', icon: 'icon-stack-java' },
    { name: 'Microservice', icon: 'icon-stack-microservice' },
    { name: 'NodeJS', icon: 'icon-stack-nodejs' },
    { name: 'Rails', icon: 'icon-stack-rails' },
    { name: 'Spring Boot', icon: 'icon-stack-spring' },
    { name: 'Swift', icon: 'icon-stack-swift' },
    { name: 'Vert.x', icon: 'icon-stack-vertx' },
    { name: 'Wildfly Swarm', icon: 'icon-stack-wildfly' }
  ];
  // TODO:dynamic observable list
  availablePipelines: Array<PipelineInfo> = [
    {
      name: 'Build Image',
      stages: [
        {
          tasks: [
            {
              name: 'canary image'
            }
          ]
        }
      ],
      environments: []
    },
    {
      name: 'Canary Release And Stage',
      stages: [
        {
          tasks: [
            {
              name: 'canary image'
            },
            {
              name: 'integration test'
            }
          ]
        },
        {
          tasks: [
            { name: 'rolling upgrade Staging' }
          ]
        }
      ],
      environments: [
        { name: 'testing' },
        { name: 'staging' }
      ]

    },
    {
      name: 'Canary Release Stage and Approve',
      stages: [
        {
          tasks: [
            { name: 'canary image' },
            { name: 'integration test' }
          ]
        },
        {
          tasks: [
            { name: 'rolling upgrade Staging' },
            { name: 'approve' }
          ]
        },
        {
          tasks: [
            { name: 'rolling upgrade Production' }
          ]
        }
      ],
      environments: [
        { name: 'testing' },
        { name: 'staging' },
        { name: 'production' }
      ]
    },
    {
      name: 'Deploy',
      stages: [
        {
          tasks: [
            {
              name: 'deploy'
            }
          ]
        }
      ],
      environments: []

    },
    {
      name: 'Install',
      stages: [
        {
          tasks: [
            {
              name: 'install'
            }
          ]
        }
      ],
      environments: []
    }
  ];

  static defaultValue(): SpaceConfigurator {
    let configurator = new SpaceConfigurator();
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = { name: '', description: ''};
    space.relationships = {
      areas: {
        links: {
          related: ''
        }
      },
      iterations: {
        links: {
          related: ''
        }
      },
      ['owned-by']: {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    configurator.space = space;
    return configurator;
  }

  constructor() {
    this.space = {} as Space;
    this.project = new CodebaseInfo();
  }
}
