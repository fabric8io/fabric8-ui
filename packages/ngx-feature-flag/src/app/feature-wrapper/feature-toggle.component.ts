import {
  Component,
  Input,
  OnInit,
  TemplateRef
} from '@angular/core';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'f8-feature-toggle',
  template: `<ng-container [ngTemplateOutlet]="(enabled | async) ? userLevel : defaultLevel"></ng-container>`
})
export class FeatureToggleComponent implements OnInit {

  @Input() featureName: string;
  @Input() userLevel: TemplateRef<any>;
  @Input() defaultLevel: TemplateRef<any>;

  enabled: Observable<boolean>;

  constructor(private featureService: FeatureTogglesService) {}

  ngOnInit(): void {
    if (!this.featureName) {
      throw new Error('Attribute `featureName` should not be null or empty');
    }

    this.enabled = this.featureService.isFeatureUserEnabled(this.featureName);
  }

}
