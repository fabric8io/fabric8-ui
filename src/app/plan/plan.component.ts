import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router }            from '@angular/router';

import * as plannerStyles from 'fabric8-planner/src/app/app.component.css';

@Component({
  selector: 'alm-plan',
  templateUrl: 'plan.component.html',
  styles: [ plannerStyles.toString() ]
})
export class PlanComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
