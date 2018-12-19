import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { IconMap } from './iconmap';

@Directive({
  selector: '[almIcon]',
  exportAs: 'almIcon',
})
export class AlmIconDirective implements OnInit, OnChanges {
  @Input() iconType: string = 'none';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.addIcon();
  }

  ngOnChanges() {
    this.addIcon();
  }

  addIcon() {
    var iconColor: string = 'none';
    const element: HTMLElement = this.elementRef.nativeElement;
    let existingClassNames = element.className.split(' ');
    let allClassesInMap: string[] = [];
    for (let key in IconMap) {
      if (IconMap.hasOwnProperty(key)) {
        IconMap[key].icon.forEach((item: string) => {
          allClassesInMap.push(item);
        });
      }
    }

    existingClassNames.forEach((item: any) => {
      if (allClassesInMap.indexOf(item) > -1) {
        element.classList.remove(item);
      }
    });

    if (this.iconType in IconMap) {
      iconColor = IconMap[this.iconType].color;
      element.setAttribute('style', 'color:' + iconColor);
      IconMap[this.iconType].icon.forEach((item: any) => {
        element.classList.add(item);
      });
    } else {
      iconColor = IconMap['default'].color;
      element.setAttribute('style', 'color:' + iconColor);
      IconMap['default'].icon.forEach((item: any) => {
        element.classList.add(item);
      });
    }
  }
}
