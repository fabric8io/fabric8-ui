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
  private message: string = 'Your e-mail has been confirmed.';
  private secMessage: string = 'Thank you for validating your e-mail address.' +
  'You can now continue to use Openshift.io';

  constructor(
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (this.route.snapshot.queryParams['verified']) {
      this.verified = this.route.snapshot.queryParams['verified'] === 'true';
      if (this.verified === false) {
        this.message = this.route.snapshot.queryParams['error'];
        this.secMessage = 'It appears there is a problem with validating your e-mail.' +
        'You can reset your e-mail on your Profile Page';
      }
    }
  }
  goHome(): void {
    this.router.navigate(['/', '_home']);
  }
}
