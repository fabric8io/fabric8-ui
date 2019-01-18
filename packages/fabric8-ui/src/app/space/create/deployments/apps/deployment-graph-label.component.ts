import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'deployment-graph-label',
  templateUrl: 'deployment-graph-label.component.html',
  styleUrls: ['./deployment-graph-label.component.less'],
})
export class DeploymentGraphLabelComponent implements OnChanges {
  @Input() type: string;
  @Input() dataMeasure: string;
  @Input() value: number;
  @Input() valueUpperBound: number;

  label: string;

  ngOnChanges(): void {
    if (this.value === undefined) {
      this.label = 'N/A';
      return;
    }

    if (this.valueUpperBound !== undefined) {
      this.label = `${this.value} of ${this.valueUpperBound}`;
    } else {
      this.label = `${this.value} ${this.dataMeasure}`;
    }
  }
}
