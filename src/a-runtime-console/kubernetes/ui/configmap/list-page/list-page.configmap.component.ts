import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ConfigMaps} from "../../../model/configmap.model";
import {ConfigMapStore} from "../../../store/configmap.store";


@Component({
  selector: 'fabric8-configmaps-list-page',
  templateUrl: './list-page.configmap.component.html',
})
export class ConfigMapsListPage implements OnInit {
  private readonly configmaps: Observable<ConfigMaps>;
  private readonly loading: Observable<boolean>;

  constructor(private configmapsStore: ConfigMapStore) {
    this.configmaps = this.configmapsStore.list;
    this.loading = this.configmapsStore.loading;
  }

  ngOnInit() {
    this.configmapsStore.loadAll();
  }

}
