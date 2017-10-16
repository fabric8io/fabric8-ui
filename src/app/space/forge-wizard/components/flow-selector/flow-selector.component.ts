import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'flow-selector',
  templateUrl: './flow-selector.component.html',
  styleUrls: ['./flow-selector.component.less']
})
export class FlowSelectorComponent implements OnInit {
  @Input() space: string;
  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    console.log(`FlowSelectorComponent ngOnInit`);
  }

  select(flow: string) {
    switch (flow) {
      case 'import': {
        this.onSelect.emit({flow: flow});
        break;
      }
      case 'quickstart': {
        this.onSelect.emit({flow: flow});
        break;
      }
      default: {
        // TODO close modal and navigate;
        break;
      }
    }
  }

  cancel() {
    this.onCancel.emit({});
  }

}
