import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RedirectData, RedirectStatusData } from '../../models/redirect-data';

@Component({
  selector: 'f8-redirect-status',
  templateUrl: 'redirect-status.component.html'
})
export class RedirectStatusComponent implements OnInit {

  private redirects: Map<string, RedirectData> = new Map([
    [
      '_verifyEmail', {
        success: {
          statusMessage: 'Your e-mail has been confirmed.',
          secondaryStatusMessage: 'Thank you for validating your e-mail address. You can now continue to use CodeReady Toolchain.',
          callToActionUrl: '_home',
          callToActionLabel: 'home dashboard'
        },
        fail: {
          statusMessage: '',
          secondaryStatusMessage: 'It appears there is a problem with validating your e-mail. You can reset your e-mail on your Profile Page',
          callToActionUrl: '_profile',
          callToActionLabel: 'profile'
        }
      }
    ]
  ]);

  redirectStatus: string;
  redirectData: RedirectStatusData;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const redirectType = this.route.snapshot.params.redirectType;
    const queryParams = this.route.snapshot.queryParams;
    this.redirectStatus = queryParams.status;
    if (this.redirects.has(redirectType) && this.redirectStatus) {
      this.redirectData = this.redirects.get(redirectType)[this.redirectStatus];
      if (this.redirectStatus === 'fail') {
        this.redirectData.statusMessage = queryParams.error;
      }
    }
  }
}
