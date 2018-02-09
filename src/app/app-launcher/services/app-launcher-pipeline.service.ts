import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Pipeline, PipelineService } from 'ngx-forge';

@Injectable()
export class AppLauncherPipelineService implements PipelineService {

  constructor() {
  }

  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([
      {
        'pipelineId': 'Pipeline1',
        'suggested': true,
        'name': 'Release',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name']
      }, {
        'pipelineId': 'Pipeline2',
        'name': 'Release and Stage',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name', 'Stage Name']
      }, {
        'pipelineId': 'Pipeline3',
        'name': 'Release, Stage, Approve and Promote',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name', 'Stage Name', 'Stage Name']
      }] as Pipeline[]);
    return pipelines;
  }
}
