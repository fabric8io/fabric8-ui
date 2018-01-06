import { Component, Input } from '@angular/core';
import { BuildConfig } from '../../../model/buildconfig.model';

@Component({
  selector: 'fabric8-buildconfig-view-toolbar',
  templateUrl: './view-toolbar.buildconfig.component.html',
  styleUrls: ['./view-toolbar.buildconfig.component.less']
})
export class BuildConfigViewToolbarComponent {

  @Input() buildconfig: BuildConfig;

}
