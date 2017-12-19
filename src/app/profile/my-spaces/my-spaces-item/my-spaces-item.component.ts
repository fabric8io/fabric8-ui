import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Space } from 'ngx-fabric8-wit';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item',
  styleUrls: ['./my-spaces-item.component.less'],
  templateUrl: './my-spaces-item.component.html'
})
export class MySpacesItemComponent implements OnInit {
  @Input() space: Space;

  constructor() {
  }

  ngOnInit(): void {
    let s = this.space;
  }
}
