import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'container-toggler',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './container-toggler.html',
  styleUrls: ['container-toggler.scss']
})

export class ContainerTogglerComponent {
  @Output() nextBtn = new EventEmitter();
  @Output() prevBtn = new EventEmitter();

  cosntructor() {

  }

  prev(): void {
    this.prevBtn.emit('P');
  }

  next(): void {
    this.nextBtn.emit('N');
  }
}
