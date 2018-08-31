import { TestBed } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import {
  Config,
  HelperService,
  Pipeline,
  TokenProvider
} from 'ngx-launcher';

import { FABRIC8_FORGE_API_URL } from '../../../shared/runtime-console/fabric8-ui-forge-api';
import { NewForgeConfig } from '../shared/new-forge.config';
import { AppLauncherPipelineService } from './app-launcher-pipeline.service';


function initTestBed() {
  TestBed.configureTestingModule({
    imports: [
      HttpModule
    ],
    providers: [
      AppLauncherPipelineService,
      HelperService,
      TokenProvider,
      {provide: Config, useClass: NewForgeConfig},
      {provide: FABRIC8_FORGE_API_URL, useValue: 'url-here'},
      {provide: XHRBackend, useClass: MockBackend}
    ]
  });
}
// TODO uncomment once using v2.0.0 of ngx-launcher
// function mockPipelines(): Pipeline[] {
//   return <Pipeline[]> [{
//     id: 'maven-releaseandstage',
//     platform: 'maven',
//     name: 'Release and Stage',
//     stages: [
//       {
//         name: 'Build Release',
//         description: 'creates a new version then builds and deploys the project into the maven repository'
//       },
//       {
//         name: 'Rollout to Stage',
//         description: 'stages the new version into the Stage environment'
//       }
//     ],
//     suggested: true
//   },
//     {
//       id: 'node-releaseandstage',
//       platform: 'node',
//       name: 'Release and Stage',
//       stages: [
//         {
//           name: 'Build Release',
//           description: 'creates a new version then builds and deploys the project into the maven repository'
//         },
//         {
//           name: 'Rollout to Stage',
//           description: 'stages the new version into the Stage environment'
//         }
//       ],
//       suggested: false
//     }
//   ];
// }
//
// describe('Service: AppLauncherPipelineService', () => {
//   let appLauncherPipelineService: AppLauncherPipelineService;
//   let mockBackend: MockBackend;
//
//   beforeEach(() => {
//     initTestBed();
//     appLauncherPipelineService = TestBed.get(AppLauncherPipelineService);
//     mockBackend = TestBed.get(XHRBackend);
//   });
//
//   // FIXME https://github.com/openshiftio/openshift.io/issues/4140
//   xit('should return all pipelines when no platform specified', (done: DoneFn) => {
//     mockBackend.connections.subscribe((connection) => {
//       connection.mockRespond(new Response(new ResponseOptions({
//         body: JSON.stringify(mockPipelines())
//       })));
//     });
//
//     appLauncherPipelineService.getPipelines().subscribe(response => {
//       expect(response.length).toBe(2);
//       done();
//     });
//   });
//
//   it('should return filtered pipelines based on platform name', (done: DoneFn) => {
//     mockBackend.connections.subscribe((connection) => {
//       connection.mockRespond(new Response(new ResponseOptions({
//         body: JSON.stringify(mockPipelines())
//       })));
//     });
//
//     appLauncherPipelineService.getPipelines('node').subscribe(response => {
//       let pipelines: Pipeline[] = response;
//       expect(pipelines.length).toBe(1);
//       expect(pipelines[0].id).toEqual('node-releaseandstage');
//       done();
//     });
//   });
//
//   it('should return empty pipeline collection when response is empty', (done: DoneFn) => {
//     mockBackend.connections.subscribe((connection) => {
//       connection.mockRespond(new Response(new ResponseOptions({
//         body: JSON.stringify([])
//       })));
//     });
//
//     appLauncherPipelineService.getPipelines().subscribe(response => {
//       let pipelines: Pipeline[] = response;
//       expect(pipelines.length).toBe(0);
//       done();
//     });
//   });
//
//   it('should return empty pipelines collection when no match found for the platform name', (done: DoneFn) => {
//     mockBackend.connections.subscribe((connection) => {
//       connection.mockRespond(new Response(new ResponseOptions({
//         body: JSON.stringify(mockPipelines())
//       })));
//     });
//
//     appLauncherPipelineService.getPipelines('rust').subscribe(response => {
//       let pipelines: Pipeline[] = response;
//       expect(pipelines.length).toBe(0);
//       done();
//     });
//   });
//
// });
