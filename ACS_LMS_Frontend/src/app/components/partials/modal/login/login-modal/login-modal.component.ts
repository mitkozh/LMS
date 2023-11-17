import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'app/core/auth.service';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  form = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  isAuthenticated = false;
  isWaiting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    
  }


}
