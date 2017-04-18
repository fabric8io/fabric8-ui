import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.scss']
})
export class EnvironmentWidgetComponent {

  @Output() addToSpace = new EventEmitter();

}
