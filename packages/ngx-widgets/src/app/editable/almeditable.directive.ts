import {
  AfterContentInit,
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
  selector: '[almEditable]',
  exportAs: 'almEditable',
})
export class AlmEditableDirective implements OnInit, OnChanges {
  @Output('onUpdate') onUpdate = new EventEmitter();

  @Input() editable = true;

  private content: any = '';

  private element: HTMLElement = this.elementRef.nativeElement;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.element.style.whiteSpace = 'pre-wrap';
    if (this.editable) {
      this.makeEditable();
    }
  }

  ngOnChanges() {
    if (this.editable) {
      this.makeEditable();
    } else {
      this.makeNonEditable();
    }
  }

  onEdit() {
    const newContent = this.element.innerText;
    if (this.content !== newContent) {
      this.content = newContent;
      this.onUpdate.emit(this.content);
    }
  }

  makeEditable() {
    this.element.setAttribute('contenteditable', 'true');
    this.element.focus();
  }

  makeNonEditable() {
    this.element.removeAttribute('contenteditable');
  }

  @HostListener('window:keyup', ['$event'])
  listenToKeypress(event: any) {
    if (this.editable) {
      this.onEdit();
    }
  }

  @HostListener('focus')
  focusField() {
    setTimeout(() => {
      if (this.element.childNodes.length) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(
          this.element.childNodes[this.element.childNodes.length - 1],
          this.element.childNodes[this.element.childNodes.length - 1].childNodes.length,
        );
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }
}
