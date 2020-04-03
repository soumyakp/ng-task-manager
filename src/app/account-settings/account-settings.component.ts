import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {SuccessDialogComponent} from '../dialog/success-dialog/success-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  userForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
    birthday: [Date, [Validators.required]]
  });
  maxDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
  }

  ngOnInit() {
    this.authService.getUser()
      .subscribe(user => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            birthday: user.birthday
          });
        },
        error => {
          console.log(error);
        }
      );
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onUpdate() {
    let user;
    if (this.userForm.get('password').value) {
      user = this.userForm.value;
    } else {
      // {password, ...user} = this.userForm.value;
      user = {
        name: this.userForm.get('name').value,
        email: this.userForm.get('email').value,
        birthday: this.userForm.get('birthday').value
      };
    }
    this.authService.editUser(user)
      .subscribe(res => {
        // successfully update
        this.snackBar.open('Your credential updated successfully!', '', {
          duration: 2000
        });
        // this.dialog.open(SuccessDialogComponent, {
        //   width: '250px',
        //   data: {
        //     type: 'api',
        //     message: 'Your credential updated successfully!'
        //   }
        // });
      }, error => {
        console.log(error);
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '250px',
      data: {
        type: 'confirm',
        message: 'Want to remove your account?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.isDelete) {
          this.authService.deleteUser()
            .subscribe(result => {
              this.snackBar.open('Your account deleted successfully!', '', {
                duration: 2000
              });
              this.authService.removeToken();
              this.authService.setAuthListener();
              this.router.navigate(['/signup']);
            }, error => {
              console.log(error);
            });
        }
      }
    });
  }
}
