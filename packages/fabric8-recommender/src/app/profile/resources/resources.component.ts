import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { DummyService } from '../../shared/dummy.service';


@Component({
  selector: 'alm-resources',
  templateUrl: 'resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(
    private router: Router,
    public dummy: DummyService) {
  }

  ngOnInit() {

  }

}
