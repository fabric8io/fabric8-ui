import * as jsyaml from 'js-yaml';
import { defaultBuildIconStyle } from './buildconfig.model';
import { KubernetesSpecResource } from './kuberentesspecresource.model';
import { PipelineStage } from './pipelinestage.model';
import { pathJoin } from './utils';

const serviceEnvironmentsAnnotationPrefix = 'environment.services.fabric8.io/';

export function sortedKeys(map: Map<String, any>): string[] {
  const answer = [];
  for (const key in map) {
    answer.push(key);
  }
  answer.sort();
  return answer;
}

export class Build extends KubernetesSpecResource {
  statusPhase: string;

  duration: number;

  iconStyle: string;

  buildNumber: string;

  buildNumberInt: number = 0;

  buildConfigName: string;

  jenkinsBuildURL: string;

  logURL: string;

  repositoryInformation: any;

  private _pipelineStages: Array<PipelineStage>;

  private _serviceUrls: Array<ServiceUrl> = new Array<ServiceUrl>();

  private _serviceEnvironmentsMap: Map<string, ServiceEnvironments> = new Map<
    string,
    ServiceEnvironments
  >();

  get serviceUrls(): Array<ServiceUrl> {
    // lets force the lazy creation
    const foo = this.serviceEnvironmentMap;
    return this._serviceUrls;
  }

  get serviceEnvironmentMap(): Map<string, ServiceEnvironments> {
    const annotations = this.annotations;
    if (annotations) {
      for (const key in annotations) {
        if (key && key.indexOf(serviceEnvironmentsAnnotationPrefix) === 0) {
          const yamlText = annotations[key];
          const envKey = key.substring(serviceEnvironmentsAnnotationPrefix.length);
          if (envKey) {
            try {
              const config = jsyaml.safeLoad(yamlText);
              if (config) {
                const se = new ServiceEnvironments(
                  config.environmentName as string,
                  config.serviceUrls as Map<string, string>,
                  config.deploymentVersions as Map<string, string>,
                );
                this._serviceEnvironmentsMap[envKey] = se;
              }
            } catch (e) {
              console.log('annotation on build ' + this.name + ' could not parse YAML: ' + e);
            }
          } else {
            console.log('annotation on build ' + this.name + ' has no envKey for ' + key);
          }
        }
      }
      // now lets build the service URls
      const serviceUrls = this._serviceUrls;
      serviceUrls.splice(0, serviceUrls.length);
      const seMap = this._serviceEnvironmentsMap;
      const keys = sortedKeys(seMap);
      for (const key of keys) {
        const se = seMap[key];
        if (se) {
          const envName = se.environmentName;
          const serviceUrlMap = se.serviceUrls;
          if (envName) {
            const serviceKeys = sortedKeys(serviceUrlMap);
            for (const serviceKey of serviceKeys) {
              const url = serviceUrlMap[serviceKey];
              if (url) {
                serviceUrls.push(new ServiceUrl(envName, serviceKey, url));
              } else {
                console.log('build ' + this.name + ' does not have a URL for ' + serviceKey);
              }
            }
          }
        }
      }
    }
    return this._serviceEnvironmentsMap;
  }

  /**
   * Returns the latest pipeline stage that is associated with a running service URL
   */
  get lastPipelineStageWithService(): PipelineStage {
    let answer: PipelineStage = null;
    for (const stage of this.pipelineStages) {
      if (stage.serviceUrl) {
        answer = stage;
      }
    }
    return answer;
  }

  get pipelineStages(): Array<PipelineStage> {
    if (!this._pipelineStages) {
      this._pipelineStages = new Array<PipelineStage>();
      // lets parse the annotation from Jenkins sync plugin
      const json = this.annotations['openshift.io/jenkins-status-json'];
      if (json) {
        try {
          const obj = JSON.parse(json);
          if (obj != undefined) {
            const stages = obj.stages;
            if (stages && stages.length) {
              stages.forEach((stage) => {
                const pipelineStage = new PipelineStage(stage, this);
                if (pipelineStage.name) {
                  this._pipelineStages.push(pipelineStage);
                }
              });
            }
          }
        } catch (e) {
          // ignore bad JSON
        }
      }
    }
    return this._pipelineStages;
  }

  get firstPendingInputAction(): PendingInputAction {
    const array = this.pendingInputActions;
    return array && array.length ? array[0] : null;
  }

  get pendingInputActions(): PendingInputAction[] {
    const answer: PendingInputAction[] = [];
    const json = this.annotations['openshift.io/jenkins-pending-input-actions-json'];
    if (json) {
      try {
        const obj = JSON.parse(json);
        if (obj != undefined) {
          if (obj && obj.length) {
            obj.forEach((input) => {
              answer.push(input as PendingInputAction);
            });
          }
        }
      } catch (e) {
        // ignore bad JSON
      }
    }
    return answer;
  }

  /**
   * Returns the namespace that jenkins is running in if this Build is annotated correctly
   * or null if the namespace cannot be determined
   */
  get jenkinsNamespace(): string {
    return this.annotations['openshift.io/jenkins-namespace'];
  }

  /**
   * Returns the Jenkins test report URL if it is available
   */
  get jenkinsTestReportUrl(): string {
    return this.annotations['fabric8.io/jenkins.testReportUrl'];
  }

  updateValuesFromResource() {
    this._pipelineStages = null;
    super.updateValuesFromResource();
    const status = this.status || {};
    const spec = this.spec || {};
    this.statusPhase = status.phase || '';
    this.duration = status.duration || 0;
    if (this.duration) {
      this.duration = this.duration / 1000000000;
    }
    const statusConfig = status.config || {};
    this.buildConfigName = statusConfig.name || '';
    this.buildNumber = this.annotations['openshift.io/build.number'] || '';
    this.buildNumberInt = 0;
    if (this.buildNumber) {
      try {
        this.buildNumberInt = parseInt(this.buildNumber);
      } catch (e) {
        // ignore invalid text values
      }
    }
    this.jenkinsBuildURL = this.annotations['openshift.io/jenkins-build-uri'] || '';
    this.logURL = '';
    if (this.jenkinsBuildURL) {
      this.logURL = pathJoin(this.jenkinsBuildURL, '/console');
    }

    this.repositoryInformation = spec['source'] || {};

    switch (this.statusPhase) {
      case 'Complete':
        this.iconStyle = 'pficon-ok';
        break;
      case 'Failed':
      case 'Error':
        this.iconStyle = 'pficon-error-circle-o';
        break;
      case 'Cancelled':
        this.iconStyle = 'pficon-warning-triangle-o';
        break;
      case 'New':
      case 'Pending':
      case 'Running':
        this.iconStyle = 'pficon-running';
        break;
      default:
        this.iconStyle = defaultBuildIconStyle;
    }
  }

  defaultKind() {
    return 'Build';
  }

  defaultIconUrl(): string {
    return '';
  }
}

export class ServiceUrl {
  label: string;

  constructor(public environmentName: string, public name: string, public url: string) {
    this.label = environmentName ? environmentName + ': ' + name : name;
  }
}

export class ServiceEnvironments {
  constructor(
    public environmentName: string,
    public serviceUrls: Map<string, string>,
    public deploymentVersions: Map<string, string>,
  ) {}

  toAppInfo(name: string): AppInfo {
    const deployUrl = this.serviceUrls[name] || '';
    const version = this.deploymentVersions[name] || '';
    const environmentName = this.environmentName;
    return new AppInfo(name, deployUrl, version, environmentName);
  }
}

export class AppInfo {
  constructor(
    public name: string,
    public deployUrl: string,
    public version: string,
    public environmentName: string,
  ) {}
}

export class Builds extends Array<Build> {}

export class PendingInputAction {
  id: string;

  proceedText: string;

  message: string;

  inputs: any[];

  proceedUrl: string;

  abortUrl: string;

  redirectApprovalUrl: string;
}

export function isValidInputAction(inputAction: PendingInputAction) {
  if (inputAction) {
    return inputAction.proceedUrl;
  }
  return false;
}
