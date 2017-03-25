import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Context, Contexts } from 'ngx-fabric8-wit';

import { DummyService } from '../../shared/dummy.service';


@Component({
  selector: 'alm-resources',
  templateUrl: 'resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  context: Context;

  constructor(
    private router: Router,
    private dummy: DummyService,
    private contexts: Contexts) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {

  }

}
