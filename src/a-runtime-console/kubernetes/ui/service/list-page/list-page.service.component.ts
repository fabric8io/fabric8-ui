import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Services } from "../../../model/service.model";
import { RouteServiceStore } from "../../../store/route.service.store";


@Component({
  selector: 'fabric8-services-list-page',
  templateUrl: './list-page.service.component.html'
})
export class ServicesListPage implements OnInit {
  private readonly services: Observable<Services>;
  private readonly loading: Observable<boolean>;

  constructor(private servicesStore: RouteServiceStore) {
    this.services = this.servicesStore.list;
    this.loading = this.servicesStore.loading;
  }

  ngOnInit() {
    this.servicesStore.loadAll();
  }

}
