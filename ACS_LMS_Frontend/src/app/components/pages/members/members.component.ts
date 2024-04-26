import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user.service';
import { User } from 'app/shared/user';
import { UserRole } from 'app/shared/user-role';
import { KeycloakService } from 'keycloak-angular';
import { MessageService, SelectItem } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  users!: User[];
  loading: boolean = false;
  userRoles!: SelectItem[];
  clonedUsers: { [s: string]: User } = {};
  totalRecords = 0;

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.updateUserRoles();
  }
  updateUserRoles() {
    const roles = this.keycloakService.getUserRoles();
    if (roles.includes('ROLE_ADMIN')) {
      this.userRoles = [
        { label: 'ROLE_LIBRARIAN', value: 'ROLE_LIBRARIAN' },
        { label: 'ROLE_ASSISTANT', value: 'ROLE_ASSISTANT' },
        { label: 'ROLE_STUDENT', value: 'ROLE_STUDENT' },
        { label: 'ROLE_TEACHER', value: 'ROLE_TEACHER' },
      ];
    } else if (roles.includes('ROLE_LIBRARIAN')) {
      this.userRoles = [
        { label: 'ROLE_ASSISTANT', value: 'ROLE_ASSISTANT' },
        { label: 'ROLE_STUDENT', value: 'ROLE_STUDENT' },
        { label: 'ROLE_TEACHER', value: 'ROLE_TEACHER' },
      ];
    } else {
    }
  }

  loadUsers(event: TableLazyLoadEvent) {
    this.userService.getAllUsers(event.first!, event.rows!).subscribe((res) => {
      this.users = res.content;
      this.totalRecords = res.totalElements;
      this.loading = false;
    });
  }

  onRowEditInit(user: User) {
    this.clonedUsers[user.id!] = { ...user };
  }

  onRowEditSave(user: User) {
    if (user.name && user.role) {
      delete this.clonedUsers[user.id!];
      this.userService.updateUserWithRole(user).subscribe(
        (updatedUser) => {
          const index = this.users.findIndex((u) => u.id === updatedUser.id);
          this.users[index] = updatedUser;
        },
        (error) => {}
      );
    } else {
    }
  }

  onRowEditCancel(user: User, index: number) {
    this.users[index] = this.clonedUsers[user.id!];
    delete this.clonedUsers[user.id!];
  }
}
