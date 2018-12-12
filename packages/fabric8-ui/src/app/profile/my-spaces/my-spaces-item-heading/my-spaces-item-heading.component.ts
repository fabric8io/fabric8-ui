import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-spaces-item-heading',
  templateUrl: './my-spaces-item-heading.component.html',
  styleUrls: ['./my-spaces-item-heading.component.less']
})
export class MySpacesItemHeadingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
