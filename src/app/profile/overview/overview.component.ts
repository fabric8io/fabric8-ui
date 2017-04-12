import { Context, Contexts } from 'ngx-fabric8-wit';
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { TabsetComponent } from 'ng2-bootstrap';

// import { UserService } from './../../user/user.service';
import { DummyService } from './../../shared/dummy.service';

@Component({
  selector: 'alm-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  context: Context;

  constructor(
    private router: Router, public dummy: DummyService, contexts: Contexts) {
      contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {

  }

  routeToUpdateProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username, "_update"]);
  }
}
