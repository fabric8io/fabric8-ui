import {KubernetesResource} from './kubernetesresource.model';
//import {FunktionKindAnnotation} from "../service/kubernetes.restangular";

export class ConfigMap extends KubernetesResource {
  data: Map<string,string>;


  updateResource(resource) {
    resource.data = this.data;
    super.updateResource(resource);

/*
    if (!this.labels[FunktionKindAnnotation]) {
      var funktionKind = this.defaultFunctionKind();
      if (funktionKind) {
        this.labels[FunktionKindAnnotation] = funktionKind;
      }
    }
*/
  }

/*
  defaultFunctionKind() {
    return "";
  }
*/

  updateValuesFromResource() {
    super.updateValuesFromResource();
    this.data = this.resource.data || new Map<string,string>();
  }

  defaultKind() {
    return 'ConfigMap';
  }
}

export class ConfigMaps extends Array<ConfigMap>{
}

