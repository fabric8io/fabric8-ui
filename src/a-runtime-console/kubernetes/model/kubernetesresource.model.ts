import {BaseEntity} from '../../store/entity/entity.model';
import {openShiftBrowseResourceUrl} from "./helpers";
import {currentOAuthConfig} from '../store/oauth-config-store';

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
    this.version = this.labels["version"] || "";

    // for Replicas we need to also look in the spec.template.metadata.annotations
    let spec = resource.spec || {};
    let template = spec.template || {};
    let templateMetadata = template.metadata || {};
    let templateAnnotations = templateMetadata.annotations || new Map<string, string>();

    this.icon = this.annotations['fabric8.io/iconUrl'] || templateAnnotations['fabric8.io/iconUrl'] || this.defaultIconUrl();

    // lets fix up old image URIs
    if (this.isFabric8Icon(this.icon, "camel")) {
      this.icon = "/_assets/images/icon-stack-camel.png";
    } else if (this.isFabric8Icon(this.icon, "funktion")) {
      this.icon = "/_assets/images/icon-stack-funktion.png";
    } else if (this.isFabric8Icon(this.icon, "go")) {
      this.icon = "/_assets/images/icon-stack-go.png";
    } else if (this.isFabric8Icon(this.icon, "java")) {
      this.icon = "/_assets/images/icon-stack-java.png";
    } else if (this.isFabric8Icon(this.icon, "maven")) {
      this.icon = "/_assets/images/icon-stack-maven.png";
    } else if (this.isFabric8Icon(this.icon, "microservice")) {
      this.icon = "/_assets/images/icon-stack-microservice.png";
    } else if (this.isFabric8Icon(this.icon, "nodejs")) {
      this.icon = "/_assets/images/icon-stack-nodejs.png";
    } else if (this.isFabric8Icon(this.icon, "python")) {
      this.icon = "/_assets/images/icon-stack-python.png";
    } else if (this.isFabric8Icon(this.icon, "rails")) {
      this.icon = "/_assets/images/icon-stack-rails.png";
    } else if (this.isFabric8Icon(this.icon, "spring")) {
      this.icon = "/_assets/images/icon-stack-spring.png";
    } else if (this.isFabric8Icon(this.icon, "swift")) {
      this.icon = "/_assets/images/icon-stack-swift.png";
    } else if (this.isFabric8Icon(this.icon, "vertx")) {
      this.icon = "/_assets/images/icon-stack-vertx.png";
    } else if (this.isFabric8Icon(this.icon, "wildfly")) {
      this.icon = "/_assets/images/icon-stack-wildfly.png";
    }
    // TODO any other annotations we should look for?
    this.description = this.annotations['description'] || templateAnnotations['description'] || '';

    this.openShiftConsoleUrl = openShiftBrowseResourceUrl(this, currentOAuthConfig());
  }

  isFabric8Icon(url, name) {
    if (url && (url.startsWith("img/icons/") || url.startsWith("/img/icons/"))) {
      return url.endsWith(name + ".svg") || url.endsWith(name + ".png") || url.endsWith(name + ".jpg");
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
