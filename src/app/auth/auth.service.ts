import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';

import {environment} from '../../environments/environment';
import {SuccessDialogComponent} from '../dialog/success-dialog/success-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface SignupUser {
  username: string;
  email: string;
  password: string;
  birthday: Date;
  agree: boolean;
}

const BACKEND_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthentication = false;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private isAuthenticated = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  userSignup(user: SignupUser) {
    this.http.post<{ user: object, token: string }>
    (`${BACKEND_URL}users`, user, this.httpOptions)
      .subscribe(response => {
          // const dialogRef = this.dialog.open(SuccessDialogComponent, {
          //   width: '250px',
          //   data: {
          //     type: 'api',
          //     message: 'You signed up & logged in successfully!'
          //   }
          // });
          // dialogRef.afterClosed().subscribe(result => {
          const message = 'You signed up & logged in successfully!';
          this.snackBar.open(message, '', {
            duration: 2000,
          });
          this.storeToken(response.token);
          this.isAuthenticated.next(true);
          this.router.navigate(['/tasks']);
          // });
        },
        error => {
          console.log(error);
          this.isAuthenticated.next(false);
        });
  }

  userLogin(user: any) {
    this.http.post<any>
    (`${BACKEND_URL}users/login`, user, this.httpOptions)
      .subscribe(res => {
          // const dialogRef = this.dialog.open(SuccessDialogComponent, {
          //   width: '250px',
          //   data: {
          //     type: 'api',
          //     message: 'You logged in successfully!'
          //   }
          // });
          // dialogRef.afterClosed().subscribe(result => {
          const message = 'You logged in successfully!';
          this.snackBar.open(message, '', {
            duration: 2000,
          });
          this.storeToken(res.token);
          this.isAuthenticated.next(true);
          this.router.navigate(['/tasks']);
          // });
        },
        error => {
          console.log(error);
          this.isAuthenticated.next(false);
        }
      );
  }

  getAuthListener() {
    return this.isAuthenticated.asObservable();
  }

  setAuthListener() {
    this.isAuthenticated.next(false);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  userLogout() {
    this.http.post<any>
    (`${BACKEND_URL}users/logout`, {}, this.httpOptions)
      .subscribe(res => {
          this.removeToken();
          this.isAuthenticated.next(false);
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        }
      );
  }

  private storeToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  removeToken() {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  createTask(task: any) {
    return this.http.post<any>(`${BACKEND_URL}tasks`, task);
    // .subscribe(res => {
    //   console.log(res);
    //   // this.getTask().subscribe(item => {
    //   //   // may be a dialog box!
    //   // });
    // },
    // error => {
    //   console.log(error);
    // });
  }

  getTask() {
    return this.http.get<any>(`${BACKEND_URL}tasks`);
    // .subscribe(res => {
    //   console.log(res);
    // });
  }

  editTask(task: any) {
    const paramId = task._id;
    const {_id, ...taskObj} = task;
    return this.http.patch<any>(`${BACKEND_URL}tasks/${paramId}`, taskObj);
  }

  deleteTask(task: any) {
    return this.http.delete<any>(`${BACKEND_URL}tasks/${task._id}`);
  }

  getUser() {
    return this.http.get<any>(`${BACKEND_URL}users/me`);
  }

  editUser(user: any) {
    return this.http.patch<any>(`${BACKEND_URL}users/me`, user);
  }

  deleteUser() {
    return this.http.delete<any>(`${BACKEND_URL}users/me`);
  }

  addUserAvatar() {
    return this.http.post<any>(`${BACKEND_URL}users/me/avatar`, {});
  }

  getUserAvatar() {
    return this.http.get<any>(`${BACKEND_URL}users/me/avatar`);
  }

  deleteUserAvatar() {
    return this.http.delete<any>(`${BACKEND_URL}users/me/avatar`);
  }

}
