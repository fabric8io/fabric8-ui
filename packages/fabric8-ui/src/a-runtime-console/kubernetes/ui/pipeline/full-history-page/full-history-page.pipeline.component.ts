import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { combineLatest, distinctUntilChanged, map } from 'rxjs/operators';
import {
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
} from '../../../model/buildconfig.model';
import { APIsStore } from '../../../store/apis.store';
import { BuildStore } from '../../../store/build.store';
import { BuildConfigStore } from '../../../store/buildconfig.store';

@Component({
  selector: 'fabric8-pipelines-full-history-page',
  templateUrl: './full-history-page.pipeline.component.html',
})
export class PipelinesFullHistoryPage implements OnInit {
  private readonly pipelines: Observable<BuildConfigs>;
  private readonly loading: Observable<boolean>;

  constructor(
    private pipelinesStore: BuildConfigStore,
    private buildStore: BuildStore,
    private apiStore: APIsStore,
  ) {
    this.loading = this.pipelinesStore.loading.pipe(
      combineLatest(this.buildStore.loading, (f, s) => f && s),
    );
    this.pipelines = this.pipelinesStore.list.pipe(
      combineLatest(this.buildStore.list, combineBuildConfigAndBuilds),
      map(filterPipelines),
    );
  }

  ngOnInit() {
    this.apiStore.load();
    this.apiStore.loading.pipe(distinctUntilChanged()).subscribe((flag) => {
      if (!flag) {
        // lets wait until we've loaded the APIS before trying to load the BuildConfigs
        this.pipelinesStore.loadAll();
        this.buildStore.loadAll();
      }
    });
  }
}
