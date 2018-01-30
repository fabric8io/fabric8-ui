import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mission, MissionRuntimeService, Runtime } from 'ngx-forge';

@Injectable()
export class AppLauncherMissionRuntimeService implements MissionRuntimeService {

  constructor() {
  }

  getMissions(): Observable<Mission[]> {
    let missions = Observable.of([
      {
        'missionId': 'BasicApplication',
        'suggested': true,
        'title': 'Basic Application',
        'description': 'Brief description of the Basic Application mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': 'Crud',
        'title': 'Crud',
        'description': 'Brief description of the Crud mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': 'CircuitBreaker',
        'title': 'Circuit Breaker',
        'description': 'Brief description of the Circuit Breaker mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': 'ExternalizedConfiguration',
        'title': 'Externalized Configuration',
        'description': 'Brief description of the Externalized Configuration mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': 'RESTAPILevel0',
        'title': 'REST API Level 0',
        'description': 'Brief description of the REST API Level 0 mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': '1',
        'title': 'Another Item 1',
        'description': 'Brief description of the another item mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': '2',
        'title': 'Another Item 2',
        'description': 'Brief description of the another item mission and what it does.',
        'supportedRuntimes': []
      }, {
        'missionId': '3',
        'title': 'Another Item 3',
        'description': 'Brief description of the another item mission and what it does.',
        'supportedRuntimes': []
      }] as Mission[]);
    return missions;
  }

  getRuntimes(): Observable<Runtime[]> {
    let runtimes = Observable.of([
      {
        'runtimeId': 'SpringBoot',
        'title': 'Spring Boot',
        'description': 'Brief description of the technology...',
        'logo': '../../../assets/images/spring-boot-logo.png',
        'supportedMissions': [],
        'versions': ['v1.0.0', 'v1.0.1', 'v2.0.1']
      }, {
        'runtimeId': 'Nodejs',
        'title': 'Node.js',
        'description': 'Brief description of the technology...',
        'logo': '../../../assets/images/nodejs-logo.png',
        'supportedMissions': [],
        'versions': ['v1.0.0', 'v3.0.1', 'v3.0.2']
      }, {
        'runtimeId': 'Eclipse Vert.x',
        'title': 'Eclipse Vert.x',
        'description': 'Brief description of the technology...',
        'logo': '../../../assets/images/vertx.svg',
        'supportedMissions': [],
        'versions': ['v1.0.0']
      }, {
        'runtimeId': 'Wildfly Swarm',
        'title': 'Wildfly Swarm',
        'description': 'Brief description of the technology...',
        'logo': '../../../assets/images/wildfly-swarm.png',
        'supportedMissions': [],
        'versions': ['v1.0.0', 'v2.0.0', 'v2.0.1']
      }
    ] as Runtime[]);
    return runtimes;
  }
}
