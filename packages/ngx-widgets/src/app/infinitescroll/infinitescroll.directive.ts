import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[almInfiniteScroll]',
  exportAs: 'almInfiniteScroll',
})
export class InfiniteScrollDirective implements OnInit {
  @Output('initItems') initItems = new EventEmitter();
  @Output('fetchMore') fetchMore = new EventEmitter();
  @Input() eachElementHeightInPx: number = 20;
  @Input() fetchThreshold: number = 5;
  pageSize: number = 10;
  lastCheckedHeight = 0;
  previousScrollHeight = 0;

  constructor(private elementRef: ElementRef) {}

  private element: HTMLElement = this.elementRef.nativeElement;

  ngOnInit() {
    this.pageSize = Math.ceil(this.element.offsetHeight / this.eachElementHeightInPx);
    // Page should always have more elements than it can hold
    // Normally twice than threshold value
    this.pageSize += this.fetchThreshold * 2;
    this.initContentItems();
  }

  initContentItems() {
    this.initItems.emit({
      pageSize: this.pageSize,
    });
  }

  @HostListener('scroll', ['$event'])
  onScrollContainer(event: any) {
    if (this.element.scrollHeight > this.lastCheckedHeight) {
      this.previousScrollHeight = this.element.scrollHeight;
      let remainingHeight =
        this.element.scrollHeight - (this.element.offsetHeight + this.element.scrollTop);
      let remainingElement = Math.ceil(remainingHeight / this.eachElementHeightInPx);
      if (remainingElement < this.fetchThreshold) {
        this.lastCheckedHeight = this.element.scrollHeight;
        this.fetchMore.emit();
      }
    } else if (this.element.scrollHeight < this.previousScrollHeight) {
      // To check if the list is reloaded
      this.previousScrollHeight = this.element.scrollHeight;
      this.lastCheckedHeight = 0;
      this.element.scrollTop = 0; // Scroll the list to top
    }
  }
}
