import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { DummyService } from './../shared/dummy.service';

@Component({
  host:{
      'class':"app-component flex-container in-column-direction flex-grow-1"
  },
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router, public dummy: DummyService) {
  }

  ngOnInit() {}

}
