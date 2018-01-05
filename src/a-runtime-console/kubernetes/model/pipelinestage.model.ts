import { Build } from "./build.model";
import { pathJoin } from "./utils";

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
    var obj = data || {};
    this.id = obj.id || "";
    this.name = obj.name || "";
    this.status = obj.status || "";
    this.startTimeMillis = obj.startTimeMillis || 0;
    this.durationMillis = obj.durationMillis || 0;
    this.pauseDurationMillis = obj.pauseDurationMillis || 0;
    this.stageFlowNodes = obj.stageFlowNodes || [];

    let jenkinsBuildURL = build.jenkinsBuildURL;
    if (jenkinsBuildURL && this.status === "PAUSED_PENDING_INPUT") {
      this.jenkinsInputURL = pathJoin(jenkinsBuildURL, "/input");
    }

    let serviceEnvironmentMap = build.serviceEnvironmentMap;
    let name = this.name;
    if (name) {
      let idx = name.lastIndexOf(' ');
      if (idx >= 0) {
        name = name.substring(idx + 1);
      }
      if (name) {
        for (let key in serviceEnvironmentMap) {
          let se = serviceEnvironmentMap[key];
          if (name === se.environmentName) {
            this.environmentName = name;
            let urlMap = se.serviceUrls;
            this.serviceUrlMap = urlMap;

            let buildConfigName = build.buildConfigName;
            if (buildConfigName) {
              this.serviceUrl = urlMap[buildConfigName] || "";
            }
          }
        }
      }
    }
  }
}


