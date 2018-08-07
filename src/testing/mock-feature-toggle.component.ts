import {
  Component,
  Input,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'f8-feature-toggle',
  template: `<ng-container [ngTemplateOutlet]="userLevel"></ng-container>`
})
export class MockFeatureToggleComponent {
  @Input() featureName: string;
  @Input() userLevel: TemplateRef<any>;
  @Input() defaultLevel: TemplateRef<any>;
}
