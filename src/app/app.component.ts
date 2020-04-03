import {Component, DoCheck, HostListener, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  isLogoutLoading = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

  ngDoCheck() {
    this.isLogoutLoading = this.authService.isLogoutLoading;
  }

}

