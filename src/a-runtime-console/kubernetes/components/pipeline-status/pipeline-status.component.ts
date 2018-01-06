import { Component, Input } from '@angular/core';
import { PipelineStage } from '../../model/pipelinestage.model';

@Component({
  selector: 'pipeline-status',
  templateUrl: './pipeline-status.component.html',
  styleUrls: ['./pipeline-status.component.less']
})
export class PipelineStatusComponent {

  @Input() stage: PipelineStage;

}
