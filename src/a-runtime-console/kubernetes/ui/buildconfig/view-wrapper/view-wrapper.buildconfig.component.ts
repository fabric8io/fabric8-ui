import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BuildConfig } from '../../../model/buildconfig.model';
import { BuildConfigStore } from '../../../store/buildconfig.store';
import { AbstractViewWrapperComponent } from '../../../support/abstract-viewwrapper-component';

@Component({
  selector: 'fabric8-buildconfig-view-wrapper',
  templateUrl: './view-wrapper.buildconfig.component.html'
})
export class BuildConfigViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  buildconfig: Observable<BuildConfig>;

  constructor(private store: BuildConfigStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.buildconfig = this.store.resource;
  }
}
