import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BuildConfig } from '../../../../a-runtime-console/index';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-applications-list',
  templateUrl: './applications-list.component.html',
})
export class ApplicatonsListComponent implements OnInit {
  @Input() buildConfigs: BuildConfig[];

  constructor() {}

  ngOnInit(): void {}
}
