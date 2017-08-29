import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work',
  templateUrl: 'work.component.html'
})
export class WorkComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
