import { DummyService } from './../dummy/dummy.service';
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

@Component({
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
