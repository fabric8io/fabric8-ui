import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Pods } from '../../../model/pod.model';
import { PodStore } from '../../../store/pod.store';


@Component({
  selector: 'fabric8-pods-list-page',
  templateUrl: './list-page.pod.component.html'
})
export class PodsListPage implements OnInit {
  private readonly pods: Observable<Pods>;
  private readonly loading: Observable<boolean>;

  constructor(private podsStore: PodStore) {
    this.pods = this.podsStore.list;
    this.loading = this.podsStore.loading;
  }

  ngOnInit() {
    this.podsStore.loadAll();
  }

}
