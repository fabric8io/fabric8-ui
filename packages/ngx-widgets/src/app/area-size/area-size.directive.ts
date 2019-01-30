import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[textAreaResize]',
})
export class AreaSizeDirective implements AfterViewInit {
  private element: HTMLElement = this.elementRef.nativeElement;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.setStyle(
      this.element,
      'height',
      `${this.elementRef.nativeElement.scrollHeight}px`,
    );
  }

  @HostListener('input', ['$event'])
  resizeOnInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.renderer.setStyle(this.element, 'height', '1px');
    this.renderer.setStyle(this.element, 'height', `${input.scrollHeight}px`);
  }
}
