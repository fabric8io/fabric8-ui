import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Space } from '../../../model/space.model';
import { SpaceStore } from '../../../store/space.store';
import { AbstractViewWrapperComponent } from '../../../support/abstract-viewwrapper-component';

@Component({
  selector: 'fabric8-space-view-wrapper',
  templateUrl: './view-wrapper.space.component.html'
})
export class SpaceViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  space: Observable<Space>;

  constructor(private store: SpaceStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.space = this.store.resource;
  }
}
