import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-create',
  templateUrl: 'create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
