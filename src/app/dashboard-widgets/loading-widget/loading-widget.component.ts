import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-loading-widget',
  templateUrl: './loading-widget.component.html',
  styleUrls: ['./loading-widget.component.less']
})
export class LoadingWidgetComponent implements OnInit {
  @Input() message: string;

  constructor() {
  }

  ngOnInit(): void {
  }
}
