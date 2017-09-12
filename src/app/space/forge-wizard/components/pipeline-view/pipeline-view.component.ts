import { Component, Input, OnInit } from '@angular/core';
import { Input as GuiInput } from "app/space/forge-wizard/gui.model";

@Component({
  selector: 'pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: [ './pipeline-view.component.less' ]
})
export class PipelineViewComponent implements OnInit {

  @Input() field: GuiInput;

  constructor() {}

  ngOnInit() {}

}
