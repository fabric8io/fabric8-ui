import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'deployment-graph-label',
  templateUrl: 'deployment-graph-label.component.html',
  styleUrls: ['./deployment-graph-label.component.less']
})
export class DeploymentGraphLabelComponent {
  @Input() type: string;
  @Input() dataMeasure: string;
  @Input() value: number;
  @Input() valueUpperBound: number;
}
