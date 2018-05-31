import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-loading-widget',
  templateUrl: './loading-widget.component.html',
  styleUrls: ['./loading-widget.component.less']
})
export class LoadingWidgetComponent implements OnInit {
  /**
   * The message
   */
  @Input() message: string;

  /**
   * The message title
   */
  @Input() title: string;

  constructor() {
  }

  ngOnInit(): void {
  }
}
