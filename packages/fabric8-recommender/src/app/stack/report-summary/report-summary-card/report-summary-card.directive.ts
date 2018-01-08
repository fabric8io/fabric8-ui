import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[summaryCardClick]'
})
export class ReportSummaryCardDirective {
    element: HTMLElement;
    constructor(private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    @HostListener('click') onCardClick() {
        this.element.classList.add('highlight');
    }

}