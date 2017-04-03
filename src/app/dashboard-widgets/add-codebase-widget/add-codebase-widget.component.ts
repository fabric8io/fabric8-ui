import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts, Spaces } from 'ngx-fabric8-wit';

import { Observable } from 'rxjs';

import { CodebasesService } from './../../create/codebases/services/codebases.service';
import { Codebase } from './../../create/codebases/services/codebase';
import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-add-codebase-widget',
  templateUrl: './add-codebase-widget.component.html',
  styleUrls: ['./add-codebase-widget.component.scss']
})
export class AddCodebaseWidgetComponent implements OnInit {

  codebases: Observable<Codebase[]>;
  codebaseCount: Observable<number>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private codebaseService: CodebasesService,
    private spaces: Spaces
  ) { }

  ngOnInit() {
    this.codebases = this.spaces.current
      .switchMap(space => this.codebaseService.getCodebases(space.id));
    this.codebaseCount = this.spaces.current
      .switchMap(space => this.codebaseService.getCodebases(space.id))
      .map(codebases => codebases.length);
  }

}
