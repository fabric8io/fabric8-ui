import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CollaboratorService } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  host: {
    class: 'add-dialog',
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.less'],
})
export class AddCollaboratorsDialogComponent implements OnInit {
  @Input() host: ModalDirective;
  @Input() spaceId: string;

  @Output() onAdded = new EventEmitter<User[]>();

  collaborators: User[] = [];
  selectedCollaborators: User[];
  loading: Boolean = false;
  searchTerm = new Subject<string>();

  constructor(private userService: UserService, private collaboratorService: CollaboratorService) {}

  ngOnInit(): void {
    this.searchTerm
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term) => this.userService.getUsersBySearchString(term)),
      )
      .subscribe(
        (users: User[]) => {
          this.collaborators = users;
          this.sortCollaborators();
          this.loading = false;
        },
        () => {
          this.collaborators = [];
        },
      );
  }

  onOpen(): void {
    this.reset();
  }

  addCollaborators(): void {
    this.collaboratorService
      .addCollaborators(this.spaceId, this.selectedCollaborators)
      .subscribe(() => {
        this.onAdded.emit(this.selectedCollaborators as User[]);
        this.reset();
        this.host.hide();
      });
  }

  cancel(): void {
    this.reset();
    this.host.hide();
  }

  private reset(): void {
    this.collaborators = [];
    this.selectedCollaborators = [];
  }

  private sortCollaborators(): void {
    this.collaborators.sort(
      (a: User, b: User): number =>
        a.attributes.fullName.localeCompare(b.attributes.fullName) ||
        a.attributes.username.localeCompare(b.attributes.username),
    );
  }
}
