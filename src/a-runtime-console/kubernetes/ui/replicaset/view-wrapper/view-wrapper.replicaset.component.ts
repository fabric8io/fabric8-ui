import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplicaSet } from '../../../model/replicaset.model';
import { AbstractViewWrapperComponent } from '../../../support/abstract-viewwrapper-component';
import { ActivatedRoute } from '@angular/router';
import { CompositeReplicaSetStore } from '../../../store/compositedreplicaset.store';

@Component({
  selector: 'fabric8-replicaset-view-wrapper',
  templateUrl: './view-wrapper.replicaset.component.html'
})
export class ReplicaSetViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  replicaset: Observable<ReplicaSet>;

  constructor(private store: CompositeReplicaSetStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.replicaset = this.store.resource;
  }
}
