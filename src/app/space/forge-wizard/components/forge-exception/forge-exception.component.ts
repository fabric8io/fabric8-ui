import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'forge-exception',
  templateUrl: './forge-exception.component.html',
  styleUrls: ['./forge-exception.component.less']
})
export class ForgeExceptionComponent implements OnInit {

  @Input() error: any;
  @Output('onCancel') onCancel = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    console.log(`::::ForgeExceptionComponent ngOnInit error= ${JSON.stringify(this.error)}`);
  }

  cancel() {
    this.onCancel.emit({});
  }
}
