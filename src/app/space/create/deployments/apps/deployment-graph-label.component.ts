import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

@Component({
  selector: 'deployment-graph-label',
  templateUrl: 'deployment-graph-label.component.html',
  styleUrls: ['./deployment-graph-label.component.less']

})
export class DeploymentGraphLabelComponent implements OnDestroy, OnInit {
  @Input() type: any;
  @Input() dataMeasure: any;
  @Input() value: any;
  @Input() valueUpperBound: any;

  constructor() { }

  ngOnDestroy(): void { }

  ngOnInit(): void { }
}
