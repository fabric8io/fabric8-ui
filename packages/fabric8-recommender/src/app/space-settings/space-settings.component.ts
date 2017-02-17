import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-code',
  templateUrl: './space-settings.component.html',
  styleUrls: ['./space-settings.component.scss']
})
export class SpaceSettingsComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

}
