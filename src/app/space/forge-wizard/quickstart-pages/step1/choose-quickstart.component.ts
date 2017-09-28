import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Gui} from '../../gui.model';

@Component({
  selector: 'quickstart',
  templateUrl: './choose-quickstart.component.html'
})
export class ChooseQuickstartComponent {
  @Input() gui: Gui;
  @Input() form: FormGroup;
}

