import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'alm-analyze',
  templateUrl: 'analyze.component.html',
  styleUrls: ['./analyze.component.scss']})
export class AnalyzeComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
