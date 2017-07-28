import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Build} from "../../../model/build.model";
import {BuildStore} from "../../../store/build.store";
import {AbstractViewWrapperComponent} from "../../../support/abstract-viewwrapper-component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'fabric8-build-view-wrapper',
  templateUrl: './view-wrapper.build.component.html',
  styleUrls: ['./view-wrapper.build.component.scss'],
})
export class BuildViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {
  build: Observable<Build>;

  constructor(private store: BuildStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.build = this.store.resource;
  }
}
