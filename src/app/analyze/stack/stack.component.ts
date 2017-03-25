import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'alm-stack',
  templateUrl: 'stack.component.html',
  styleUrls: ['./stack.component.scss']
})
export class StackComponent implements OnInit {

  public codebases: Array<any> = [{
    name: 'Pllm',
    uuid: 'ff59ea91cf264003bc6dc12621c91205'
  }];

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
