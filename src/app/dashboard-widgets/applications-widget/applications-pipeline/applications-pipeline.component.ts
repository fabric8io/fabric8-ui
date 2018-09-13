import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { PipelineStage } from '../../../../a-runtime-console/kubernetes/model/pipelinestage.model';

@Component({
  selector: 'fabric8-applications-pipeline',
  templateUrl: './applications-pipeline.component.html',
  styleUrls: ['./applications-pipeline.component.less']
})
export class ApplicationsPipelineComponent implements OnInit {
  @Input() stage: PipelineStage;

  @Input() showLine: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
