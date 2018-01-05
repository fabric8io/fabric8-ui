import { AfterViewInit } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParentLinkFactory } from './../../../../common/parent-link-factory';
import { Component } from '@angular/core';
import { trimEnd } from 'lodash';

@Component({
  selector: 'fabric8-environments-detail',
  templateUrl: './detail.environment.component.html'
})
export class EnvironmentDetailComponent implements OnInit, AfterViewInit {

  parentLink: string;

  itemName: string;
  itemIcon: string;
  panelState = 'out';

  constructor(
    parentLinkFactory: ParentLinkFactory,
    private router: Router
  ) {
    this.parentLink = parentLinkFactory.parentLink;
  }

  ngOnInit(): void {
    this.itemName = 'test item';
    this.itemIcon = 'fa-calendar';
  }

  ngAfterViewInit(): void {
    // Open the panel
    // Why use a setTimeOut -
    // This is for unit testing.
    // After every round of change detection,
    // dev mode immediately performs a second round to verify
    // that no bindings have changed since the end of the first,
    // as this would indicate that changes are being caused by change detection itself.
    // I had to triggers another round of change detection
    // during that method - emit an event, whatever. Wrapping it in a timeout would do the job
    setTimeout(() => {
      this.panelState = 'in';
    });
  }

  close() {
    let url = this.router.url;
    let terminator = 'environments';
    let newurl = url.slice(0, url.lastIndexOf(terminator) + terminator.length);
    // Wait for the animation to finish
    // From in to out it takes 300 ms
    // So wait for 400 ms
    setTimeout(() => {
      this.router.navigateByUrl(trimEnd(newurl));
    }, 400);
  }

  togglePanelState(event: any): void {
    if (event === 'out') {
      this.close();
    }
  }

}
