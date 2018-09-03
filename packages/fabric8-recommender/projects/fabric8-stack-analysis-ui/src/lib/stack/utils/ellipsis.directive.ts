import {Directive, ElementRef, Input, HostListener} from '@angular/core';

@Directive({
    selector: '[ellipsis]'
})
export class EllipsisDirective {
    public element: HTMLElement;
    @HostListener('mouseenter') onMouseEnter() {
        this.element.style.whiteSpace = 'unset';
    }
    @HostListener('mouseleave') onMouseLeave() {
        this.element.style.whiteSpace = 'nowrap';
    }
    constructor(private el: ElementRef) {
        this.element = el.nativeElement;
        this.element.classList.add('ellipsis');
    }
}
