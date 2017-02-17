import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

@Component({
  selector: 'alm-codebases',
  templateUrl: 'codebases.component.html',
  styleUrls: ['./codebases.component.scss']
})
export class CodebasesComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }


}
