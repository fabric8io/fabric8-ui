// import {
//   async,
//   ComponentFixture,
//   fakeAsync,
//   inject,
//   TestBed,
//   tick
// } from '@angular/core/testing';

// import { DebugElement } from '@angular/core';
// import { FormsModule }  from '@angular/forms';
// import { By }           from '@angular/platform-browser';

// import { Logger } from '../../shared/logger.service';

// import { DropdownOption } from './dropdown-option';
// import { DropdownComponent } from './dropdown.component';


// describe('Dropdown component - ', () => {
//   let comp: DropdownComponent;
//   let fixture: ComponentFixture<DropdownComponent>;
//   let el: DebugElement;
//   let options: DropdownOption[];
//   let slectedOption: DropdownOption;

//   beforeEach(() => {
//     options = [
//       {
//         id: 1,
//         option: 'option1',
//         option_class: 'option1',
//         active_class: 'option1_active'
//       },
//       {
//         id: 2,
//         option: 'option2',
//         option_class: 'option2',
//         active_class: 'option2_active'
//       },
//       {
//         id: 3,
//         option: 'option3',
//         option_class: 'option3',
//         active_class: 'option3_active'
//       }
//     ] as DropdownOption[];

//     slectedOption = {
//       id: 1,
//       option: 'option1',
//       option_class: 'option1',
//       active_class: 'option1_active'
//     } as DropdownOption;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [FormsModule],
//       declarations: [DropdownComponent]
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(DropdownComponent);
//         comp = fixture.componentInstance;
//       });
//   }));

//   it('Should toggle the dropdown on click', () => {
//     comp.options = options;
//     comp.selected = slectedOption;
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('.btn'));

//     // First click - should show the list
//     el.triggerEventHandler('click', {});
//     fixture.detectChanges();
//     let testEl = fixture.debugElement.query(By.css('ul'));
//     expect(testEl).not.toBeNull();

//     // Seconf click - should hide the list
//     el.triggerEventHandler('click', {});
//     fixture.detectChanges();
//     testEl = fixture.debugElement.query(By.css('ul'));
//     expect(testEl).toBeNull();
//   });

//   it('Should trigger event on change with the correct selected option', (done) => {
//     comp.onUpdate.subscribe((data: any) => {
//       expect(data.newOption).toBe(options[1]);
//       done();
//     });

//     comp.options = options;
//     comp.selected = slectedOption;
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('.btn'));

//     // Click on the label to open the list
//     el.triggerEventHandler('click', {});
//     fixture.detectChanges();
//     let option2El = fixture.debugElement.query(By.css('.option2'));

//     // Click on an item from the list
//     option2El.triggerEventHandler('click', {});
//     fixture.detectChanges();
//   });
// });