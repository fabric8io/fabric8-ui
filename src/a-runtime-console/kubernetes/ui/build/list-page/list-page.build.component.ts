import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Builds } from '../../../model/build.model';
import { BuildStore } from '../../../store/build.store';
import { APIsStore } from '../../../store/apis.store';


@Component({
  selector: 'fabric8-builds-list-page',
  templateUrl: './list-page.build.component.html'
})
export class BuildsListPage implements OnInit {
  private readonly builds: Observable<Builds>;
  private readonly loading: Observable<boolean>;

  constructor(private buildsStore: BuildStore, private apiStore: APIsStore) {
    this.builds = this.buildsStore.list;
    this.loading = this.buildsStore.loading;
  }

  ngOnInit() {
    this.apiStore.load();
    this.apiStore.loading.distinctUntilChanged().subscribe((flag) => {
      if (!flag) {
        // lets wait until we've loaded the APIS before trying to load the Builds
        this.buildsStore.loadAll();
      }
    });
  }

}
