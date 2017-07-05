import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyze',
  templateUrl: 'analyze.component.html',
  styleUrls: ['./analyze.component.less']})
export class AnalyzeComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
