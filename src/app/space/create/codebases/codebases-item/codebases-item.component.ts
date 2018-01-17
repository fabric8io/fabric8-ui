import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Che } from '../services/che';
import { Codebase } from '../services/codebase';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item',
  templateUrl: './codebases-item.component.html'
})
export class CodebasesItemComponent implements OnDestroy, OnInit {
  @Input() cheState: Che;
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  constructor() {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}
