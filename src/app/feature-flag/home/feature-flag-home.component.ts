import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-feature-flag-home',
  templateUrl: './feature-flag-home.component.html'
})
export class FeatureFlagHomeComponent implements OnInit, OnDestroy {
  private subcription: Subscription;
  featureEnablementLevel = 'beta'; // default to beta
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subcription = this.activatedRoute.queryParams.subscribe(params => {
      if (!params.q && params.showBanner) { // avoid planner query override
        this.featureEnablementLevel = params.showBanner;
      }
    });
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

}
