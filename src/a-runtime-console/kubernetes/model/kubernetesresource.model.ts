import { BaseEntity } from '../../store/entity/entity.model';
import { currentOAuthConfig } from '../store/oauth-config-store';
import { openShiftBrowseResourceUrl } from './helpers';

import iconCamel from '../../../assets/images/icon-stack-camel.png';
import iconFunktion from '../../../assets/images/icon-stack-funktion.png';
import iconGo from '../../../assets/images/icon-stack-go.png';
import iconJava from '../../../assets/images/icon-stack-java.png';
import iconMaven from '../../../assets/images/icon-stack-maven.png';
import iconMicroservice from '../../../assets/images/icon-stack-microservice.png';
import iconNodeJS from '../../../assets/images/icon-stack-nodejs.png';
import iconPython from '../../../assets/images/icon-stack-python.png';
import iconRails from '../../../assets/images/icon-stack-rails.png';
import iconSpring from '../../../assets/images/icon-stack-spring.png';
import iconSwift from '../../../assets/images/icon-stack-swift.png';
import iconVertx from '../../../assets/images/icon-stack-vertx.png';
import iconWildfly from '../../../assets/images/icon-stack-wildfly.png';


export class KubernetesResource implements BaseEntity {
  id: string;
  name: string;
  version: string;
  namespace: string;
  description: string;
  icon: string;
  labels: Map<string, string> = new Map<string, string>();
  annotations: Map<string, string> = new Map<string, string>();
  resource: any;
  creationTimestamp: any;
  openShiftConsoleUrl: string;

  public setResource(resource) {
    this.resource = resource || {};
    this.updateValuesFromResource();
    return this;
  }

  updateResource(resource) {
    if (!this.labels) {
      this.labels = new Map<string, string>();
    }
    if (!this.annotations) {
      this.annotations = new Map<string, string>();
    }
    this.annotations['description'] = this.description;

    let metadata = resource.metadata;
    if (!metadata) {
      metadata = {};
      resource.metadata = metadata;
    }
    if (this.name) {
      metadata.name = this.name;
    }
    metadata.labels = this.labels;
    metadata.annotations = this.annotations;
  }

  updateValuesFromResource() {
    let resource = this.resource || {};
    let metadata = resource.metadata || {};
    this.name = metadata.name || '';
    this.namespace = metadata.namespace || '';
    this.id = this.name;
    this.creationTimestamp = metadata.creationTimestamp;
    this.labels = metadata.labels || new Map<string, string>();
    this.annotations = metadata.annotations || new Map<string, string>();
    this.version = this.labels['version'] || '';

    // for Replicas we need to also look in the spec.template.metadata.annotations
    let spec = resource.spec || {};
    let template = spec.template || {};
    let templateMetadata = template.metadata || {};
    let templateAnnotations = templateMetadata.annotations || new Map<string, string>();

    this.icon = this.annotations['fabric8.io/iconUrl'] || templateAnnotations['fabric8.io/iconUrl'] || this.defaultIconUrl();

    // lets fix up old image URIs
    if (this.isFabric8Icon(this.icon, 'camel')) {
      this.icon = iconCamel;
    } else if (this.isFabric8Icon(this.icon, 'funktion')) {
      this.icon = iconFunktion;
    } else if (this.isFabric8Icon(this.icon, 'go')) {
      this.icon = iconGo;
    } else if (this.isFabric8Icon(this.icon, 'java')) {
      this.icon = iconJava;
    } else if (this.isFabric8Icon(this.icon, 'maven')) {
      this.icon = iconMaven;
    } else if (this.isFabric8Icon(this.icon, 'microservice')) {
      this.icon = iconMicroservice;
    } else if (this.isFabric8Icon(this.icon, 'nodejs')) {
      this.icon = iconNodeJS;
    } else if (this.isFabric8Icon(this.icon, 'python')) {
      this.icon = iconPython;
    } else if (this.isFabric8Icon(this.icon, 'rails')) {
      this.icon = iconRails;
    } else if (this.isFabric8Icon(this.icon, 'spring')) {
      this.icon = iconSpring;
    } else if (this.isFabric8Icon(this.icon, 'swift')) {
      this.icon = iconSwift;
    } else if (this.isFabric8Icon(this.icon, 'vertx')) {
      this.icon = iconVertx;
    } else if (this.isFabric8Icon(this.icon, 'wildfly')) {
      this.icon = iconWildfly;
    }
    // TODO any other annotations we should look for?
    this.description = this.annotations['description'] || templateAnnotations['description'] || '';

    this.openShiftConsoleUrl = openShiftBrowseResourceUrl(this, currentOAuthConfig());
  }

  isFabric8Icon(url, name) {
    if (url && (url.startsWith('img/icons/') || url.startsWith('/img/icons/'))) {
      return url.endsWith(name + '.svg') || url.endsWith(name + '.png') || url.endsWith(name + '.jpg');
    }
    return false;
  }

  defaultIconUrl() {
    return '/img/kubernetes.svg';
  }

  defaultKind() {
    return 'Unknown';
  }
}
