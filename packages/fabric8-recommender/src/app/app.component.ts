import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'f8-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public stackUrl: string =
    'https://recommender.api.openshift.io/api/v1/stack-analyses/421249d9e1e5464cbf3e77dde4941463';

  constructor() {}
  ngOnInit(): void {
    console.log('Inside ngInit');
  }
}
