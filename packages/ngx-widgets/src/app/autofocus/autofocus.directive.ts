import { Directive, ElementRef, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[afinput]',
})
export class AutofocusDirective {
  private focus = true;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  @Input() set autofocus(condition: boolean) {
    this.focus = condition !== false;

    if (this.focus) {
      // Otherwise Angular throws error: Expression has changed after it was checked.
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      }, 0);
    }
  }
}
