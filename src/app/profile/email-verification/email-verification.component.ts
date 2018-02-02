import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Component({
  selector: 'fabric8-cleanup',
  templateUrl: 'email-verification.component.html',
  styleUrls: ['./email-verification.component.less']
})
export class EmailVerificationComponent implements OnInit {

  private verified: boolean = false;
  constructor(
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (this.route.snapshot.queryParams['verified']) {
      this.verified = this.route.snapshot.queryParams['verified'];
      console.log('verified', this.verified);
    }
  }
}
