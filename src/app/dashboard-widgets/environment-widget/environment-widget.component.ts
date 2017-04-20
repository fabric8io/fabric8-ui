import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { Contexts } from 'ngx-fabric8-wit';

@Component({
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.scss']
})
export class EnvironmentWidgetComponent implements OnInit{

  contextPath: Observable<string>;

  constructor(private context: Contexts) {
  }

  ngOnInit() {
    this.contextPath = this.context.current.map(context => context.path);
  }

}
