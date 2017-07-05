import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
