import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { IForgeRequest, IForgeResponse, ForgeService } from '../contracts/forge-service';
import { LoggerFactory, ILoggerDelegate } from '../../common/logger';

@Injectable()
export class MockForgeService extends ForgeService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };

  constructor(loggerFactory:LoggerFactory) {
    super();
    let logger=loggerFactory.createLoggerDelegate(this.constructor.name, MockForgeService.instanceCount++);
    if(logger)
    {
        this.log=logger      
    }
    this.log(`New instance...`);
  }
  ExecuteCommand(options: IForgeRequest = { command: { name: "empty" } }): Observable<IForgeResponse> {
    switch (options.command.name) {
      case "forge-new-project": {
        // base url: /forge/commands/
        // obsidian-new-project/validate/
        // obsidian-new-project/next/
        // obsidian-new-project/execute
        return getForgeNewProject();
      }
      case "forge-new-quickstart": {
        // base url: /forge/commands/
        // obsidian-new-quickstart/next/
        // obsidian-new-quickstart/validate/
        // /obsidian-new-quickstart/
        return getForgeNewQuickStart();
      }
      default: {
        return getEmptyResponse();
      }
    }
  }
}
function getEmptyResponse(): Observable<IForgeResponse> {
  return Observable.create((observer: Observer<IForgeResponse>) => {
    observer.next({ payload: {} })
  });
}




function getForgeNewQuickStart(): Observable<IForgeResponse> {
  return Observable.create((observer: Observer<IForgeResponse>) => {
    let payload = {
      metadata: { "deprecated": false, "category": "Obsidian", "name": "Obsidian: New Quickstart", "description": "Generate your project from a quickstart" },
      state: { "valid": true, "canExecute": true, "wizard": false },
      inputs: [
        {
          "name": "type",
          "shortName": " ",
          "valueType": "org.apache.maven.archetype.catalog.Archetype",
          "inputType": "org.jboss.forge.inputType.DEFAULT",
          "enabled": true,
          "required": true,
          "deprecated": false,
          "label": "Project type",
          "description": "",
          "valueChoices": [
            {
              "id": "Creates a new Spring Boot Tomcat - Rest & Config Map",
              "artifactId": "rest_configmap_springboot-tomcat-archetype",
              "description": "Creates a new Spring Boot Tomcat - Rest & Config Map", 
              "goals": "[]", 
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}",
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui",
              "version": "1.0.0-SNAPSHOT"
            },
            {
              "id": "Creates a new WildFly Swarm - Config Map",
              "artifactId": "rest_configmap_swarm-archetype",
              "description": "Creates a new WildFly Swarm - Config Map",
              "goals": "[]",
              "groupId": "org.obsidiantoaster.quickstarts",
              "properties": "{}",
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", "version": "1.0.0-SNAPSHOT"
            },
            {
              "id": "Creates a new Vert.x - Rest & Config Map",
              "artifactId": "rest_configmap_vertx-archetype",
              "description": "Creates a new Vert.x - Rest & Config Map",
              "goals": "[]",
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}", 
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", 
              "version": "1.0.0-SNAPSHOT"
            }, 
            { 
              "id": "Creates a new Spring Boot Tomcat - Rest", 
              "artifactId": "rest_springboot-tomcat-archetype", 
              "description": "Creates a new Spring Boot Tomcat - Rest", 
              "goals": "[]", 
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}", 
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", 
              "version": "1.0.0-SNAPSHOT" 
            }, 
            { 
              "id": "Creates a new Vertx - Rest", 
              "artifactId": "rest_vertx-archetype", 
              "description": "Creates a new Vertx - Rest", 
              "goals": "[]", 
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}", 
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", "version": "1.0.0-SNAPSHOT" }, { "id": "Creates a new WildFly Swarm - Rest", "artifactId": "rest_wildfly-swarm-archetype", "description": "Creates a new WildFly Swarm - Rest", "goals": "[]", "groupId": "org.obsidiantoaster.quickstarts", "properties": "{}", "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", "version": "1.0.0-SNAPSHOT" }, { "id": "Creates a new Secured Spring Boot Tomcat - Rest & Red Hat SSO", "artifactId": "secured_rest-springboot-archetype", "description": "Creates a new Secured Spring Boot Tomcat - Rest & Red Hat SSO", "goals": "[]", "groupId": "org.obsidiantoaster.quickstarts", "properties": "{}", "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", 
              "version": "1.0.0-SNAPSHOT" 
            }, 
            { 
              "id": "Creates a new Secured Vertx - Rest & Red Hat SSO", 
              "artifactId": "secured_rest-vertx-archetype", 
              "description": "Creates a new Secured Vertx - Rest & Red Hat SSO", 
              "goals": "[]", 
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}", 
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", 
              "version": "1.0.0-SNAPSHOT" 
            }, 
            { 
              "id": "Creates a new Secured Swarm - Rest & Red Hat SSO", 
              "artifactId": "secured_rest_swarm-archetype", 
              "description": "Creates a new Secured Swarm - Rest & Red Hat SSO", 
              "goals": "[]", 
              "groupId": "org.obsidiantoaster.quickstarts", 
              "properties": "{}", 
              "repository": "jar:file:/private/var/folders/n1/d5gbwypx3gn7h3dxkvz444s00000gn/T/wildfly-self-contained3581772513192948429.d/vfs/wildfly-swarm/wildfly-swarmc63b561a01bc0b13/generator.war-2724a0f83fe8fe74/WEB-INF/addons/org-obsidiantoaster-forge-obsidian-generator-1-0-0-SNAPSHOT/obsidian-generator-1.0.0-SNAPSHOT-forge-addon.jar!/org/obsidiantoaster/generator/ui", 
              "version": "1.0.0-SNAPSHOT" 
            }], 
            "class": "UISelectOne", 
            "value": "Creates a new Spring Boot Tomcat - Rest & Config Map"
        }, 
        { 
          "name": "named", "shortName": " ", "valueType": "java.lang.String", "inputType": "org.jboss.forge.inputType.DEFAULT", "enabled": true, "required": true, "deprecated": false, "label": "Project name", "description": "The following characters are accepted: -_.a-zA-Z0-9", "note": "Downloadable project zip and application jar are based on the project name", "class": "UIInput", "value": "demo" }, 
        {
          "name": "topLevelPackage", "shortName": " ", "valueType": "java.lang.String", "inputType": "org.jboss.forge.inputType.DEFAULT", "enabled": true, "required": true, "deprecated": false, "label": "Top level package", "description": "The following characters are accepted: -_.a-zA-Z0-9", "class": "UIInput", "value": "com.example"
        },
        { 
          "name": "version", "shortName": " ", "valueType": "java.lang.String", "inputType": "org.jboss.forge.inputType.DEFAULT", "enabled": true, "required": true, "deprecated": false, "label": "Project version", "description": "", "class": "UIInput", "value": "1.0.0-SNAPSHOT" 
        }]
    };
    observer.next({
      payload: payload
    })
  });
}



function getForgeNewProject(): Observable<IForgeResponse> {
  return Observable.create((observer: Observer<IForgeResponse>) => {
    observer.next({
      payload: {
        "metadata": {
          "deprecated": false,
          "category": "Obsidian",
          "name": "Obsidian: New Project",
          "description": "Generate your project"
        },
        "state": {
          "valid": true,
          "canExecute": false,
          "wizard": true,
          "canMoveToNextStep": true,
          "canMoveToPreviousStep": false
        },
        "inputs": [
          {
            "name": "type",
            "shortName": " ",
            "valueType": "org.jboss.forge.addon.projects.ProjectType",
            "inputType": "org.jboss.forge.inputType.DEFAULT",
            "enabled": true,
            "required": true,
            "deprecated": false,
            "label": "Project type",
            "description": "",
            "valueChoices": [
              {
                "id": "Spring Boot",
                "requiredFacets": "[interface org.jboss.forge.addon.projects.facets.MetadataFacet, interface org.jboss.forge.addon.projects.facets.PackagingFacet, interface org.jboss.forge.addon.projects.facets.DependencyFacet, interface org.jboss.forge.addon.projects.facets.ResourcesFacet, interface org.jboss.forge.addon.projects.facets.WebResourcesFacet, interface org.jboss.forge.addon.parser.java.facets.JavaSourceFacet, interface org.jboss.forge.addon.parser.java.facets.JavaCompilerFacet]",
                "setupFlow": "class io.fabric8.forge.devops.springboot.SpringBootSetupFlow",
                "type": "Spring Boot"
              },
              {
                "id": "WildFly Swarm",
                "requiredFacets": "[interface org.jboss.forge.addon.projects.facets.MetadataFacet, interface org.jboss.forge.addon.projects.facets.PackagingFacet, interface org.jboss.forge.addon.projects.facets.DependencyFacet, interface org.jboss.forge.addon.projects.facets.ResourcesFacet, interface org.jboss.forge.addon.projects.facets.WebResourcesFacet, interface org.jboss.forge.addon.parser.java.facets.JavaSourceFacet, interface org.jboss.forge.addon.parser.java.facets.JavaCompilerFacet]",
                "setupFlow": "class org.jboss.forge.addon.swarm.project.WildFlySwarmSetupFlow",
                "type": "WildFly Swarm"
              },
              {
                "id": "Vert.x",
                "requiredFacets": "[class io.vertx.forge.VertxMavenFacet]",
                "type": "Vert.x"
              }
            ],
            "class": "UISelectOne",
            "value": "Spring Boot"
          },
          {
            "name": "named",
            "shortName": " ",
            "valueType": "java.lang.String",
            "inputType": "org.jboss.forge.inputType.DEFAULT",
            "enabled": true,
            "required": true,
            "deprecated": false,
            "label": "Project name",
            "description": "",
            "class": "UIInput",
            "value": "demo"
          },
          {
            "name": "topLevelPackage",
            "shortName": " ",
            "valueType": "java.lang.String",
            "inputType": "org.jboss.forge.inputType.DEFAULT",
            "enabled": true,
            "required": false,
            "deprecated": false,
            "label": "Top level package",
            "description": "",
            "class": "UIInput",
            "value": "com.example"
          },
          {
            "name": "version",
            "shortName": " ",
            "valueType": "java.lang.String",
            "inputType": "org.jboss.forge.inputType.DEFAULT",
            "enabled": true,
            "required": true,
            "deprecated": false,
            "label": "Project version",
            "description": "",
            "class": "UIInput",
            "value": "1.0.0-SNAPSHOT"
          }
        ]

      }
    })
    observer.complete();
  })
}
