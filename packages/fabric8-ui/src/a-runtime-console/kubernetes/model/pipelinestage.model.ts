import { Build } from './build.model';
import { pathJoin } from './utils';

export class PipelineStage {
  id: string;

  name: string;

  status: string;

  jenkinsInputURL: string;

  startTimeMillis: number;

  durationMillis: number;

  pauseDurationMillis: number;

  stageFlowNodes: any[];

  serviceUrlMap: Map<String, String>;

  serviceUrl: string;

  environmentName: string;

  constructor(data, public build: Build) {
    const obj = data || {};
    this.id = obj.id || '';
    this.name = obj.name || '';
    this.status = obj.status || '';
    this.startTimeMillis = obj.startTimeMillis || 0;
    this.durationMillis = obj.durationMillis || 0;
    this.pauseDurationMillis = obj.pauseDurationMillis || 0;
    this.stageFlowNodes = obj.stageFlowNodes || [];

    const jenkinsBuildURL = build.jenkinsBuildURL;
    if (jenkinsBuildURL && this.status === 'PAUSED_PENDING_INPUT') {
      this.jenkinsInputURL = pathJoin(jenkinsBuildURL, '/input');
    }

    const serviceEnvironmentMap = build.serviceEnvironmentMap;
    let name = this.name;
    if (name) {
      const idx = name.lastIndexOf(' ');
      if (idx >= 0) {
        name = name.substring(idx + 1);
      }
      if (name) {
        for (const key in serviceEnvironmentMap) {
          const se = serviceEnvironmentMap[key];
          if (name === se.environmentName) {
            this.environmentName = name;
            const urlMap = se.serviceUrls;
            this.serviceUrlMap = urlMap;
            const serviceUrlKeys: string[] = Object.keys(urlMap);
            if (serviceUrlKeys && serviceUrlKeys[0]) {
              this.serviceUrl = urlMap[serviceUrlKeys[0]];
            } else {
              this.serviceUrl = '';
            }
          }
        }
      }
    }
  }
}
