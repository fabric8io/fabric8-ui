import { NgModule, OpaqueToken } from "@angular/core";
import { Restangular } from "ng2-restangular";
import { KubernetesResource } from "../model/kubernetesresource.model";
import { Service } from "../model/service.model";
import { Event } from "../model/event.model";
import { Deployment } from "../model/deployment.model";
import { ConfigMap } from "../model/configmap.model";
import { Namespace } from "../model/namespace.model";
import { Pod } from "../model/pod.model";
import { ReplicaSet } from "../model/replicaset.model";
import { ReplicationController } from "../model/replicationcontroller.model";
import { BuildConfig } from "../model/buildconfig.model";
import { DeploymentConfig } from "../model/deploymentconfig.model";
import { Build } from "../model/build.model";
import { OAuthService } from "angular2-oauth2/oauth-service";
import { OnLogin } from "../../shared/onlogin.service";
import { currentOAuthConfig } from "../store/oauth-config-store";
import { AuthenticationService } from 'ngx-login-client';
import { LoginService } from '../../shared/login.service';
import { Route } from "../model/route.model";

export const KUBERNETES_RESTANGULAR = new OpaqueToken('KubernetesRestangular');


function convertToKubernetesResource(resource) {
  // TODO would be nice to make this bit more modular so we could register other kinds of resource more easily
  let kind = resource.kind;
  if (!kind) {
    return resource;
  }
  switch (kind) {
    case 'Build':
      return new Build().setResource(resource);
    case 'BuildConfig':
      return new BuildConfig().setResource(resource);
    case 'ConfigMap':
      /*
       var metadata = resource.metadata || {};
       var labels = metadata.labels || {};
       var kindLabel = labels[FunktionKindAnnotation];
       switch (kindLabel) {
       case  "Function" :
       return new Function().setResource(resource);
       case  "Connector" :
       return new Connection().setResource(resource);
       case  "Flow" :
       return new Integration().setResource(resource);
       default:
       return new ConfigMap().setResource(resource);
       }
       */
      return new ConfigMap().setResource(resource);
    case 'Deployment':
      return new Deployment().setResource(resource);
    case 'DeploymentConfig':
      return new DeploymentConfig().setResource(resource);
    case 'Event':
      return new Event().setResource(resource);
    case 'Namespace':
    case 'Project':
      return new Namespace().setResource(resource);
    case 'Pod':
      return new Pod().setResource(resource);
    case 'ReplicaSet':
      return new ReplicaSet().setResource(resource);
    case 'ReplicationController':
      return new ReplicationController().setResource(resource);
    case 'Route':
      return new Route().setResource(resource);
    case 'Service':
      return new Service().setResource(resource);
    default:
      console.log('Unknown resource kind ' + kind);
      return new KubernetesResource().setResource(resource);
  }
}

export function KubernetesRestangularFactory(restangular: Restangular, oauthService: OAuthService, onLogin: OnLogin, loginService: LoginService) {
  const config = restangular.withConfig((RestangularConfigurer) => {
    // TODO setting the baseUrl to empty string doesn't seem to work so lets use the absolute URL of the app
    let baseUrl = '';
    let location = window.location;
    if (location) {
      let hostname = location.hostname;
      let port = location.port;
      if (hostname) {
        baseUrl = 'http://' + hostname;
        if (port) {
          baseUrl += ':' + port;
        }
      }
    }
    //console.log("using Restangular base URL " + baseUrl);
    RestangularConfigurer.setBaseUrl(baseUrl);

    //RestangularConfigurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
    RestangularConfigurer.addResponseInterceptor(function (data, operation) {
      let kind = data ? data.kind : null;
      if (operation === 'getList') {
        if (data && data.constructor !== Array) {
          if (kind && kind.endsWith('List')) {
            kind = kind.substring(0, kind.length - 4);
          }
          if (!kind) {
            // TODO lets assume for now its a 'BuildConfig' from jenkinsshift
            kind = "BuildConfig";
          }
          let resourceApiVersion = (data.metadata || {}).apiVersion;
          return (data.items || []).map((object) => {
            // ensure each item has a kind and api version
            if (!object.apiVersion) {
              object.apiVersion = resourceApiVersion;
            }
            if (!object.kind) {
              object.kind = kind;
            }
            return convertToKubernetesResource(object);
          });
        }
      } else if (data && kind) {
        return convertToKubernetesResource(data);
      }
      return data;
    });


    RestangularConfigurer.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
      let baseUrl = '';
      let oauthConfig = currentOAuthConfig();
      if (oauthConfig) {
        baseUrl = oauthConfig.proxyApiServer ||  oauthConfig.apiServer ||  '';
        if (baseUrl) {
          let protocol = oauthConfig.apiServerProtocol || 'https';
          baseUrl = protocol + "://" + baseUrl;
        }
      } else {
        console.log("No oauth config!");
      }
      // TODO setting the baseUrl to empty string doesn't seem to work so lets use the absolute URL of the app
      if (!baseUrl) {
        let location = window.location;
        if (location) {
          let hostname = location.hostname;
          let port = location.port;
          if (hostname) {
            let protocol = oauthConfig.apiServerProtocol || 'https';
            baseUrl = protocol + '://' + hostname;
            if (port) {
              baseUrl += ':' + port;
            }
          }
        }
      }
      if (oauthConfig.apiServerBasePath) {
        baseUrl += oauthConfig.apiServerBasePath;
      }
      //console.log("==========  using Restangular base URL " + baseUrl);
      RestangularConfigurer.setBaseUrl(baseUrl);

      //console.log("===== setting kubernetes token: " + (token ? "token" : "no token") + " for " + url);
      headers["Authorization"] = 'Bearer ' + onLogin.token;
       return {
         params: params,
         headers: headers,
         element: element
       }
     });
  });
  return config;
}

@NgModule({
  providers: [
    {provide: KUBERNETES_RESTANGULAR, useFactory: KubernetesRestangularFactory, deps: [Restangular, OAuthService, OnLogin]}
  ]
})
export class KubernetesRestangularModule {
}

