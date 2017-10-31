import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'f8-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public stackUrl: string =
    'https://recommender.api.openshift.io/api/v1/stack-analyses/3e13b237cade46c888aa3a1dba06696d';

  constructor() {}
  ngOnInit(): void {
    console.log('Inside ngInit');
  }

  // Request Ids for diff starter osio apps to test
  // vertex booster = aafb40f724804b919e0f2eca62a02c81
  // springboot health check = 7b97b7c12d774a1db54ece52f861621c
  // spring boot http = 3e13b237cade46c888aa3a1dba06696d
  // spring boot crud = 826f7f7d0a184ea08b6838d59c557bca
}
