import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { BuildConfigStore } from '../../../store/buildconfig.store';

@Component({
  selector: 'fabric8-pipeline-view-page',
  templateUrl: './view-page.pipeline.component.html'
})
export class PipelineViewPage implements OnDestroy {
  private idSubscription: Subscription;

  constructor(store: BuildConfigStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pipe(pluck<Params, string>('id'),
      map((id) => store.load(id)))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
