import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { ContextService } from './../../shared/context.service';
// import { UserService } from './../../user/user.service';
import { DummyService } from './../../shared/dummy.service';

@Component({
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(
    private router: Router, public dummy: DummyService, public context: ContextService) {
  }

  ngOnInit() {

  }

}
