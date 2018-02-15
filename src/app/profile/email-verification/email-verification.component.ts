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

  private verified: string = 'false';
  private message: string = 'Your e-mail has been confirmed.';
  private secMessage: string = 'Thank you for validating your e-mail address.' +
  'You can now continue to use Openshift.io';
  private messageEmoji: string = 'trophy.png';

  constructor(
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (this.route.snapshot.queryParams['verified']) {
      this.verified = this.route.snapshot.queryParams['verified'];
      if (this.verified === 'false') {
        this.message = this.route.snapshot.queryParams['error'];
        this.secMessage = 'Your e-mail has already been approved. ' +
        'Click on my profile below to continue.';
        this.messageEmoji = 'neutralface.png';
      }
    }
  }
}
