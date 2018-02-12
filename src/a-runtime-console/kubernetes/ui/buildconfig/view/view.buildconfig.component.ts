import { Component, Input } from '@angular/core';
import { BuildConfig } from '../../../model/buildconfig.model';

@Component({
  selector: 'fabric8-buildconfig-view',
  templateUrl: './view.buildconfig.component.html'
})
export class BuildConfigViewComponent {

  @Input() buildconfig: BuildConfig;
}
