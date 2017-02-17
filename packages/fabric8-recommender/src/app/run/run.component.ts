import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-run',
  templateUrl: 'run.component.html',
  styleUrls: ['./run.component.scss']
})
export class RunComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

}
