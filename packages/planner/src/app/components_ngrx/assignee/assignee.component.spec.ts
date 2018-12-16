import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { WidgetsModule } from 'ngx-widgets';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';
import { AssigneesComponent } from './assignee.component';


describe('AssigneeComponent', () => {
  let fixture: ComponentFixture<AssigneesComponent>,
    comp: AssigneesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          CommonModule,
          RouterModule,
          TooltipModule.forRoot(),
          UserAvatarModule,
          WidgetsModule
      ],
      declarations: [
        AssigneesComponent
      ],
      providers: [ TooltipConfig, BsDropdownConfig ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigneesComponent);
    comp = fixture.componentInstance;
  });

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it('should show Unassigned if assignees less than 1', async(() => {
    fixture.detectChanges();
    comp.assigneeInput = [];
    comp.overlapAvatar = false;
    let assigneesDE  = fixture.debugElement.query(By.css('small.dib')).nativeElement;
    expect(assigneesDE.textContent).toBe('Unassigned');
  }));

  it('should truncate if assignees greater than 3', async(() => {
    comp.showFullName = false;
    comp.truncateAfter = 3;
    comp.assigneeInput = [
      {'name': 'Name 1', avatar: 'https://avatars3.githubusercontent.com/u/34271052?v=4&s=25'},
      {'name': 'Name 2', avatar: 'https://avatars3.githubusercontent.com/u/34271051?v=4&s=25'},
      {'name': 'Name 3', avatar: 'https://avatars3.githubusercontent.com/u/34271053?v=4&s=25'},
      {'name': 'Name 4', avatar: 'https://avatars3.githubusercontent.com/u/34271054?v=4&s=25'}
   ];

    fixture.detectChanges();
    let assigneesDE  = fixture.debugElement.query(By.css('.f8-assignees')).nativeElement;
    expect(assigneesDE.textContent).toContain('1+');
  }));
});
