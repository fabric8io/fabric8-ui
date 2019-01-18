import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.less'],
})
export class UserAvatarComponent implements OnInit {
  @Input('imgSrc') imgSrc: string;
  @Input('imgTooltip') imgTooltip: string;
  @Input('imgPlacement') imgPlacement: string;

  ngOnInit() {}
}
