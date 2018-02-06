import { Params } from '@angular/router';

import { currentOAuthConfig } from '../store/oauth-config-store';
import { AppInfo, Build, Builds, ServiceEnvironments, ServiceUrl } from './build.model';
import { KubernetesSpecResource } from './kuberentesspecresource.model';
import { pathJoin } from './utils';

export const defaultBuildIconStyle = 'pficon-build';

export class BuildConfig extends KubernetesSpecResource {
  gitUrl: string;
  type: string;
  lastVersion: number;

  jenkinsJobUrl: string;
  editPipelineUrl: string;
  openInCheUrl: string;

  lastBuildPath: string;
  lastBuildName: string;

  // last build related data
  statusPhase: string;
  duration: number;
  iconStyle: string;

  private _builds: Array<Build> = new Array<Build>();
  interestingBuilds: Array<Build> = new Array<Build>();

  private _lastBuild: Build;

  get serviceUrls(): Array<ServiceUrl> {
    let last = this.lastBuild;
    return last ? last.serviceUrls : new Array<ServiceUrl>();
  }

  get builds(): Array<Build> {
    return this._builds;
  }

  set builds(builds: Array<Build>) {
    if (builds) {
      builds.sort((a: Build, b: Build) => b.buildNumberInt - a.buildNumberInt);
    }
    this._builds = builds;
    this.onBuildsUpdated();
  }

  get lastBuild(): Build {
    return this._lastBuild;
  }

  /**
   * When the builds are updated lets keep track of the interesting builds
   * and the last build
   */
  private onBuildsUpdated() {
    let answer = this.interestingBuilds;
    answer.splice(0, answer.length);

    let builds = this.builds;
    let lastVersionName = this.lastBuildName;
    if (lastVersionName) {
      for (let build of builds) {
        if (lastVersionName === build.name) {
          this._lastBuild = build;
        }
      }
    }
    if (!this._lastBuild && builds.length) {
      this._lastBuild = builds[0];
      if (!this.lastBuildName && this._lastBuild) {
        this.lastBuildName = this._lastBuild.name;
      }
    }

    for (let build of builds) {
      if ('Running' === build.statusPhase) {
        answer.push(build);
      }
    }
    let build = this.lastBuild;
    if (!answer.length && build) {
      answer.push(build);
    }

    this.statusPhase = build ? build.statusPhase : '';
    this.duration = build ? build.duration : 0;
    this.iconStyle = build ? build.iconStyle : defaultBuildIconStyle;
  }

  get isPipeline(): boolean {
    return 'JenkinsPipeline' === this.type;
  }

  get interestingBuildsAverageDuration(): number {
    var answer = 0;
    var count = 0;
    var builds = this.interestingBuilds;
    for (let build of builds) {
      let duration = build.duration;
      if (duration) {
        answer += duration;
        count++;
      }
    }
    if (count > 0) {
      return answer / count;
    }
    return 0;
  }

  /**
   * Returns the Jenkins test report URL of the last build if it is available
   */
  get jenkinsTestReportUrl(): string {
    let build = this.lastBuild;
    return build ? build.jenkinsTestReportUrl : '';
  }

  get serviceEnvironmentMap(): Map<string, ServiceEnvironments> {
    let build = this.lastBuild;
    if (!build) {
      return new Map<string, ServiceEnvironments>();
    }
    const answer = build.serviceEnvironmentMap;
    let builds = this.builds;
    if (builds.length && builds.length > 1) {
      let previousBuild = builds[1];
      let map = previousBuild.serviceEnvironmentMap;
      if (map) {
        for (let key in map) {
          let value = map[key];
          if (!answer[key]) {
            answer[key] = value;
          }
        }
      }
    }
    return answer;
  }

  /**
   * Returns a map indexed by the environment key of the app information
   */
  get environmentApp(): Map<string, AppInfo> {
    let map = this.serviceEnvironmentMap;
    let answer = new Map<string, AppInfo>();
    let name = this.name;
    if (map && name) {
      for (let environmentKey in map) {
        let value = map[environmentKey];
        let appInfo = value.toAppInfo(name);
        if (appInfo) {
          answer[environmentKey] = appInfo;
        }
      }
    }
    return answer;
  }


  updateValuesFromResource() {
    super.updateValuesFromResource();

    let spec = this.spec || {};
    let status = this.status || {};
    let source = spec.source || {};
    let git = source.git || {};
    let strategy = spec.strategy || {};
    let type = strategy.type || '';

    this.lastVersion = status.lastVersion || 0;
    this.lastBuildName = this.lastVersion ? this.name + '-' +  this.lastVersion : '';
    this.lastBuildPath = this.lastBuildName ? this.name + '/builds/' + this.lastBuildName : '';
    this.iconStyle = defaultBuildIconStyle;

    this.type = type;
    var gitUrl = this.annotations['fabric8.io/git-clone-url'];
    if (!gitUrl) {
      gitUrl = git.uri || '';
    }
    this.gitUrl = gitUrl;
    this.jenkinsJobUrl = this.annotations['fabric8.link.jenkins.job/url'] || '';
    this.onBuildsUpdated();

    let name = this.name;
    let namespace = this.namespace;
    let oauthConfig = currentOAuthConfig();
    if (oauthConfig) {
      let openShiftConsoleUrl = oauthConfig.openshiftConsoleUrl;
      if (openShiftConsoleUrl && namespace && name) {
        this.editPipelineUrl = pathJoin(openShiftConsoleUrl, '/project/', namespace, '/edit/pipelines/', name);
      }
    }

    // TODO create openInCheUrl URL
  }

  defaultKind() {
    return 'BuildConfig';
  }

  defaultIconUrl(): string {
    return '';
  }
}

export class BuildConfigs extends Array<BuildConfig> {
}


export function findBuildConfigByID(buildConfigs: BuildConfigs, params: Params): BuildConfig {
  let id = params['id'];
  if (id) {
    if (buildConfigs) {
      for (let buildConfig of buildConfigs) {
        if (id === buildConfig.name) {
          return buildConfig;
        }
      }
    }
  }
  return id;
}

export function combineBuildConfigAndBuilds(buildConfigs: BuildConfigs, builds: Builds): BuildConfigs {
    let map = {};
    let bcBuilds = {};
    if (builds) {
      builds.forEach(s => {
        map[s.name] = s;
        let bcName = s.buildConfigName;
        if (bcName) {
          let list = bcBuilds[bcName];
          if (!list) {
            list = new Array<Build>();
            bcBuilds[bcName] = list;
          }
          list.push(s);
        }
      });
    }
    if (buildConfigs) {
      buildConfigs.forEach(bc => {
/*
        let lastVersionName = bc.lastBuildName;
        if (lastVersionName) {
          let build = map[lastVersionName];
          if (build) {
            bc.lastBuild = build;
          }
        }
*/
        let name = bc.name;
        if (name) {
          let list = bcBuilds[name];
          if (list) {
            bc.builds = list;
          }
        }
      });
    }
    return buildConfigs;


  }

export function filterPipelines(buildConfigs: BuildConfigs): BuildConfigs {
  var answer = new BuildConfigs();
  buildConfigs.forEach(bc => {
    if (bc.isPipeline) {
      answer.push(bc);
    }
  });
  return answer;
}

/**
 * returns a map of all the environments with the apps in each environment
 */
export function appInfos(buildConfigs: BuildConfigs): Map<string, EnvironmentApps> {
  let answer = new Map<string, EnvironmentApps>();
  buildConfigs.forEach(bc => {
    let appEnv = bc.environmentApp;
    for (let environmentKey in appEnv) {
      let app = appEnv[environmentKey];
      let env = answer[environmentKey];
      if (!env) {
        env = new EnvironmentApps();
        answer[environmentKey] = env;
      }
      if (!env.name) {
        env.name = app.environmentName;
      }
      env.apps[app.name] = app;
    }
  });
  return answer;
}

/**
 * Keeps track of all the apps in each environment along with its name
 */
export class EnvironmentApps {
  apps: Map<string, AppInfo> = new Map<string, AppInfo>();
  name: string;
}
