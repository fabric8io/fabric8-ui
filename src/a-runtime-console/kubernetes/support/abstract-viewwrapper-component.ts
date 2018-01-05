import { OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { activedRouteDataEntry } from "../model/helpers";

export class AbstractViewWrapperComponent implements OnInit {
  showToolbar: boolean;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.showToolbar = activedRouteDataEntry(this.route, 'hide-toolbar') ? false : true;
  }
}
