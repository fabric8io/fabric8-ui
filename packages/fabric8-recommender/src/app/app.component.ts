import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'f8-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public stackUrl: string =
    'https://recommender.api.openshift.io/api/v1/stack-analyses/76c1b4829bf2402e8a86af632c572896';

  constructor() {}
  ngOnInit(): void {
    console.log('Inside ngInit');
  }

  // Request Ids for diff starter osio apps to test
  // vertex booster = aafb40f724804b919e0f2eca62a02c81
  // springboot health check = 7b97b7c12d774a1db54ece52f861621c
  // spring boot http = 7dfca1da25d7489796059754af8681ad
  // spring boot crud = 826f7f7d0a184ea08b6838d59c557bca
}
