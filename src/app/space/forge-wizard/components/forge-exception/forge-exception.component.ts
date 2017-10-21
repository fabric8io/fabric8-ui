import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'forge-exception',
  templateUrl: './forge-exception.component.html',
  styleUrls: ['./forge-exception.component.less']
})
export class ForgeExceptionComponent {

  @Input() error: any;
  @Output('onCancel') onCancel = new EventEmitter();
  constructor() {}

  cancel() {
    this.onCancel.emit({});
  }
}
