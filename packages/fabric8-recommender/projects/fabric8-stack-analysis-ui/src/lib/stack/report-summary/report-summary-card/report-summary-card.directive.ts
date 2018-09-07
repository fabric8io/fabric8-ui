import { Directive, ElementRef, HostListener } from '@angular/core';

import { SaveState } from '../../utils/SaveState';

@Directive({
    selector: '[summaryCardClick]'
})
export class ReportSummaryCardDirective {
    element: HTMLElement;
    private stack: Array<HTMLElement> = [];
    private HIGHLIGHT = 'highlight';
    constructor(private elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
        SaveState.ELEMENTS.push(this.element);
    }

    @HostListener('click') onCardClick() {
        this.removeAllOtherActives(this.element);
        this.element.classList.add(this.HIGHLIGHT);
    }

    private removeAllOtherActives (element: HTMLElement): void {
        if (SaveState && SaveState.ELEMENTS.length > 0) {
            SaveState.ELEMENTS.forEach((elem) => {
                if (elem !== element) {
                    if (elem && elem.classList && elem.classList.contains(this.HIGHLIGHT)) {
                        elem.classList.remove(this.HIGHLIGHT);
                    }
                }
            });
        }
    }

}
