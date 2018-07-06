import {
  Component,
  OnInit
} from '@angular/core';

import {FeatureTogglesService} from '../../app/service/feature-toggles.service';


@Component({
  selector: 'feature-toggle-example',
  styles: [`
    .sample-form .form-horizontal .form-group {
      margin-left: 0px;
    }
    .padding-top-15 {
      padding-top: 15px;
    }
    .padding-bottom-15 {
      padding-bottom: 15px;
    }
  `],
  templateUrl: './feature-toggle-service.example.component.html',
  providers: [FeatureTogglesService]
})
export class FeatureToggleServiceExampleComponent implements OnInit {

  getAllFeaturesOutput: string;
  constructor(private featureToggleService: FeatureTogglesService) {
  }

  ngOnInit(): void {
  }


  getAllFeaturesEnabledByLevel() {
    this.featureToggleService.getAllFeaturesEnabledByLevel().subscribe(val => {
      console.log(JSON.stringify(val));
      this.getAllFeaturesOutput = JSON.stringify(val, null, 2);
    });
  }
  getAllFeaturesEnabledByIds() {
    this.featureToggleService.getFeatures(['Test']).subscribe(val => {
      console.log(JSON.stringify(val));
      this.getAllFeaturesOutput = JSON.stringify(val, null, 2);
    });
  }
}
