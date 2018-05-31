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
   * The hyperlink text
   */
  @Input() hyperlinkText: string;

  /**
   * The message title
   */
  @Input() title: string;

  /**
   * The event emitted when hyperlink has been clicked
   */
  @Output('onHyperlinkClick') onHyperlinkClick = new EventEmitter();

  /**
   * The router URL
   */
  @Input() routerUrl: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  // Private

  private handleLinkAction($event: MouseEvent): void {
    this.onHyperlinkClick.emit();
  }
}
