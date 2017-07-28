import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {
  BuildConfigs, combineBuildConfigAndBuilds, filterPipelines,
  BuildConfig, findBuildConfigByID
} from "../../../model/buildconfig.model";
import {BuildConfigStore} from "../../../store/buildconfig.store";
import {APIsStore} from "../../../store/apis.store";
import {BuildStore} from "../../../store/build.store";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'fabric8-pipelines-history-page',
  templateUrl: './history-page.pipeline.component.html',
  styleUrls: ['./history-page.pipeline.component.scss'],
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
