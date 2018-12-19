import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'slide-out-example',
  templateUrl: './slide-out-example.component.html',
})
export class SlideOutExampleComponent implements OnInit {
  itemName: string;
  itemIcon: string;
  panelState: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.itemName = 'test item';
    this.itemIcon = 'fa-calendar';
    this.panelState = 'in';
  }

  togglePanel(): void {
    if (this.panelState === 'in') {
      this.panelState = 'out';
    } else {
      this.panelState = 'in';
    }
  }

  togglePanelState(event: any): void {
    this.panelState = event;
    console.log(event);
  }

  // todo - add close event and show value in some example box somewhere
}
