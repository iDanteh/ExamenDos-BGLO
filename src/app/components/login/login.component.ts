import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usersService } from '../../services/users.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showRegisterForm = false;

  toggleForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  loginForm: FormGroup;
  registerForm: FormGroup;
  loginError: boolean = false;
  registerError: boolean = false;

  constructor(private fb: FormBuilder, private userService: usersService, private router: Router, public dialog: MatDialog) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login(email, password).subscribe(isValid => {
        if (isValid) {
          console.log('Login exitoso');
          this.router.navigate(['/layout']);
        } else {
          this.loginError = true;
          this.openDialog("Error");
          console.log('Correo o contraseña incorrectos');
        }
      });
    }
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      const newUser = { name, email, password, role: 'customer', avatar: '', creationAt: '', updatedAt: '' };
      this.userService.register(newUser).subscribe(isRegistered => {
        if (isRegistered) {
          console.log('Registro exitoso');
          this.router.navigate(['/layout']);
        } else {
          this.registerError = true;
          this.openDialog("Error");
          console.log('Error en el registro');
        }
      });
    }
  }

  openDialog(message: string) {
    this.dialog.open(DialogMessage, {
      data: { message },
    });
  }
}

@Component({
  selector: 'dialog-message',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './dialog.html',
})
export class DialogMessage {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
