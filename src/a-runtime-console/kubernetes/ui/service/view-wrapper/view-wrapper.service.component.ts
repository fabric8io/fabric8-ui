import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Service } from '../../../model/service.model';
import { ServiceStore } from '../../../store/service.store';
import { AbstractViewWrapperComponent } from '../../../support/abstract-viewwrapper-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fabric8-service-view-wrapper',
  templateUrl: './view-wrapper.service.component.html'
})
export class ServiceViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  service: Observable<Service>;

  constructor(private store: ServiceStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.service = this.store.resource;
  }
}
