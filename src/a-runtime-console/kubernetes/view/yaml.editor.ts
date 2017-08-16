/// <reference path="../../../../node_modules/retyped-js-yaml-tsd-ambient/js-yaml.d.ts"/>
import * as jsyaml from 'js-yaml';

import {Injectable} from '@angular/core';
import {KubernetesResource} from '../model/kubernetesresource.model';

@Injectable()
export class YamlEditor {
  public yaml: string = '';

  loadResource(entity: KubernetesResource) {
    this.yaml = '';
    let resource = entity.resource;
    if (resource) {
      this.yaml = jsyaml.safeDump(resource);
    }
  }

  parseYaml(): any {
    if (!this.yaml) {
      return null;
    }
    return jsyaml.safeLoad(this.yaml);
  }
}
