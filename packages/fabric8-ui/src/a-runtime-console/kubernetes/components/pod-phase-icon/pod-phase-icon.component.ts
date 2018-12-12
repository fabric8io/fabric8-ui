import { Component, Input } from '@angular/core';

@Component({
  selector: 'pod-phase-icon',
  templateUrl: './pod-phase-icon.component.html'
})
export class PodPhaseIconComponent {

  @Input() phase: String;

}
