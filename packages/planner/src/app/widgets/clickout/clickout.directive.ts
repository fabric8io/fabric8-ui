import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[clickOut]',
})
export class ClickOutDirective {
  @Input('exclude') exclude: string;

  @Output('clickOut') readonly clickOut: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, target: HTMLElement): void {
    if (!target) {
      return;
    }

    const clickedInside = this.element.nativeElement.contains(target);

    if (this.exclude) {
      this.isExcluded = this.excludeCheck(target);
    }

    if (!clickedInside && !this.isExcluded) {
      this.clickOut.emit(event);
    }
  }

  private isExcluded: boolean = false;
  constructor(private element: ElementRef) {}

  excludeCheck(target: HTMLElement) {
    const excludeElements = Array.from(document.querySelectorAll(this.exclude)) as Array<
      HTMLElement
    >;
    for (let element of excludeElements) {
      if (element.contains(target)) {
        return true;
      }
    }
  }
}
