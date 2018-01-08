import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  BuildConfig, BuildConfigs, combineBuildConfigAndBuilds,
  filterPipelines, findBuildConfigByID
} from '../../../model/buildconfig.model';
import { APIsStore } from '../../../store/apis.store';
import { BuildStore } from '../../../store/build.store';
import { BuildConfigStore } from '../../../store/buildconfig.store';


@Component({
  selector: 'fabric8-pipelines-history-page',
  templateUrl: './history-page.pipeline.component.html'
})
export class PipelinesHistoryPage implements OnInit {
  private readonly pipelines: Observable<BuildConfigs>;
  private readonly pipeline: Observable<BuildConfig>;
  private readonly loading: Observable<boolean>;

  constructor(private pipelinesStore: BuildConfigStore, private buildStore: BuildStore, private apiStore: APIsStore, route: ActivatedRoute) {
    this.loading = this.pipelinesStore.loading.combineLatest(this.buildStore.loading, (f, s) => f && s);
    this.pipelines = this.pipelinesStore.list.combineLatest(this.buildStore.list, combineBuildConfigAndBuilds).
    map(filterPipelines);

    this.pipeline = this.pipelines.combineLatest(route.params, findBuildConfigByID);
  }

  ngOnInit() {
    this.apiStore.load();
    this.apiStore.loading.distinctUntilChanged().subscribe((flag) => {
      if (!flag) {
        // lets wait until we've loaded the APIS before trying to load the BuildConfigs
        this.pipelinesStore.loadAll();
        this.buildStore.loadAll();
      }
    });
  }

}
