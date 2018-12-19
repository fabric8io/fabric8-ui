import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.less'],
})
export class SidepanelComponent implements OnInit {
  @Input() sidePanelOpen: boolean = true;
  @Input() context: 'list' | 'board' = 'list'; // 'list' or 'board'

  backlogSelected: boolean = true;
  typeGroupSelected: boolean = true;

  constructor() {}

  ngOnInit() {}
  setGuidedTypeWI() {}
}
