import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Stack } from './../../../models/stack';
import { ContextService } from './../../../shared/context.service';


@Component({
  selector: 'alm-stack',
  templateUrl: 'stack-overview.component.html',
  styleUrls: ['./stack-overview.component.scss']
})
export class StackOverviewComponent implements OnInit {

  private collapsed: Map<Stack, Boolean>;

  constructor(
    private router: Router,
    public context: ContextService) {
    this.collapsed = new Map();
  }

  ngOnInit() {

  }

}
